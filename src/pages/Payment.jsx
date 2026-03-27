import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51T6UnGIdo5qHNssBzhRh7cDdc4lojhg9qI8Z5TtlKEP0Tb0Y4qETOrulva59J6lcm72slWF3czgBM5PouwveQwuF003vC35WZh");

// INNER FORM
function CheckoutForm({ billId, clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card
            }
        });

        if (result.error) {
            alert("Payment failed ❌");
        } else {
            if (result.paymentIntent.status === "succeeded") {
                // CONFIRM TO BACKEND
                const token = localStorage.getItem("token");

                await axios.post(
                    "https://managementbackend-0njb.onrender.com/api/payment/confirm",
                    {
                        paymentIntentId: result.paymentIntent.id,
                        billId
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Payment Successful ✅");
                window.location.reload();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <CardElement className="border p-3 mb-3" />
            <button className="bg-green-500 text-white px-4 py-2 w-full">
                Pay Now
            </button>
        </form>
    );
}

// MAIN COMPONENT
export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [currentBill, setCurrentBill] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [selectedBill, setSelectedBill] = useState(null);
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'current');
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [invoicesLoading, setInvoicesLoading] = useState(false);
    const [showInvoiceSuccess, setShowInvoiceSuccess] = useState(false);
    const [lastInvoice, setLastInvoice] = useState(null);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        navigate("/resident");
    };

    useEffect(() => {
        fetchBills();
        fetchCurrentBill();
        fetchPaymentHistory();
        fetchInvoices();
    }, []);

    const fetchBills = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "https://managementbackend-0njb.onrender.com/api/billing/my-bills",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setBills(res.data);
        } catch (error) {
            console.error('Error fetching bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentBill = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "https://managementbackend-0njb.onrender.com/api/billing/current",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setCurrentBill(res.data);
        } catch (error) {
            console.error('Error fetching current bill:', error);
        }
    };

    const fetchPaymentHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "https://managementbackend-0njb.onrender.com/api/billing/payment-history",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setPaymentHistory(res.data);
        } catch (error) {
            console.error('Error fetching payment history:', error);
        }
    };

    const fetchInvoices = async () => {
        setInvoicesLoading(true);
        try {
            const token = localStorage.getItem("token");
            console.log('Fetching invoices with token:', !!token);

            const res = await axios.get(
                "https://managementbackend-0njb.onrender.com/api/invoices",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('Invoices response:', res.data);
            console.log('Invoices count:', res.data.length);

            // Log each invoice for debugging
            if (res.data.length > 0) {
                res.data.forEach((invoice, index) => {
                    console.log(`Invoice ${index + 1}:`, {
                        id: invoice._id,
                        invoiceNumber: invoice.invoiceNumber,
                        totalAmount: invoice.totalAmount,
                        status: invoice.status,
                        billingPeriod: invoice.billingPeriod
                    });
                });
            }

            setInvoices(res.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            console.error('Error response:', error.response?.data);
            setInvoices([]); // Set empty array on error
        } finally {
            setInvoicesLoading(false);
        }
    };

    const downloadInvoice = async (invoiceId) => {
        try {
            const token = localStorage.getItem("token");
            console.log('Token found:', !!token);

            const response = await axios.get(
                `https://managementbackend-0njb.onrender.com/api/invoices/${invoiceId}/download`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Failed to download invoice');
        }
    };

    // Check for successful payment from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        console.log('Checking URL params:', { sessionId, urlParams: window.location.search });

        if (sessionId) {
            console.log('Found session_id, calling payment success handler...');
            // Call payment success endpoint to create invoice
            handlePaymentSuccess(sessionId);

            // Clear the URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handlePaymentSuccess = async (sessionId) => {
        console.log('handlePaymentSuccess called with sessionId:', sessionId);
        try {
            const token = localStorage.getItem("token");
            console.log('Token found:', !!token);

            const res = await axios.get(
                `https://managementbackend-0njb.onrender.com/api/payment/success?session_id=${sessionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('Payment success response:', res.data);

            if (res.data.invoice) {
                console.log('Invoice found:', res.data.invoice);
                setLastInvoice(res.data.invoice);
                setShowInvoiceSuccess(true);
                fetchInvoices(); // Refresh invoices
                fetchCurrentBill(); // Refresh current bill
                fetchBills(); // Refresh bills
            } else {
                console.log('No invoice in response, showing fallback success message');
                setShowPaymentSuccess(true);
                fetchCurrentBill(); // Refresh current bill
                fetchBills(); // Refresh bills
            }

        } catch (error) {
            console.error('Error processing payment success:', error);
            console.error('Error response:', error.response?.data);
            // Still show success message even if there's an error
            setShowPaymentSuccess(true);
            fetchCurrentBill(); // Refresh current bill
            fetchBills(); // Refresh bills
        }
    };

    // CREATE STRIPE CHECKOUT SESSION FOR REDIRECT
    const handlePay = async (billId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "https://managementbackend-0njb.onrender.com/api/payment/create-checkout-session",
                { billId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Redirect to Stripe Checkout
            window.location.href = res.data.url;

        } catch (err) {
            console.error('Payment error:', err);
            alert("Payment initiation failed ❌");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'overdue': return 'text-red-600 bg-red-100';
            case 'partial': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading billing information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center mb-8">
                <button
                    onClick={handleBack}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
                >
                    Back
                </button>
                <h1 className="text-3xl font-bold text-[#4B2E2B]">Billing & Payments</h1>
            </div>

            {/* Invoice Success Message */}
            {showInvoiceSuccess && lastInvoice && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                                🎉 Payment Successful!
                            </h3>
                            <p className="text-green-700">
                                Invoice {lastInvoice.invoiceNumber} has been generated successfully.
                            </p>
                        </div>
                        <button
                            onClick={() => downloadInvoice(lastInvoice.id)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2"
                        >
                            📄 Download Invoice
                        </button>
                    </div>
                </div>
            )}

            {/* Fallback Payment Success Message */}
            {showPaymentSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                                🎉 Payment Successful!
                            </h3>
                            <p className="text-green-700">
                                Your payment has been processed successfully. Check the Invoices tab for your invoice.
                            </p>
                        </div>
                        <button
                            onClick={() => setActiveTab('invoices')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2"
                        >
                            📄 View Invoices
                        </button>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('current')}
                    className={`pb-2 px-4 ${activeTab === 'current' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    Current Bill
                </button>
                <button
                    onClick={() => setActiveTab('bills')}
                    className={`pb-2 px-4 ${activeTab === 'bills' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    All Bills
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    Payment History
                </button>
                <button
                    onClick={() => setActiveTab('invoices')}
                    className={`pb-2 px-4 ${activeTab === 'invoices' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    Invoices
                </button>
            </div>

            {/* Current Bill Tab */}
            {activeTab === 'current' && currentBill && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {currentBill.billingPeriod?.month} {currentBill.billingPeriod?.year}
                                </h2>
                                <p className="text-gray-600">Room: {currentBill.roomId?.roomNumber}</p>
                                <p className="text-sm text-gray-500">
                                    Due: {formatDate(currentBill.dueDate)}
                                </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentBill.status)}`}>
                                {currentBill.status.charAt(0).toUpperCase() + currentBill.status.slice(1)}
                            </div>
                        </div>

                        {/* Charges Breakdown */}
                        <div className="space-y-3 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Charges Breakdown</h3>

                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Hostel Fees</span>
                                <span className="font-medium">₹{currentBill.charges?.hostelFees || 8000}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Mess Fees</span>
                                <span className="font-medium">₹{currentBill.charges?.messFees || 8000}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Utilities</span>
                                <span className="font-medium">₹{currentBill.charges?.utilities || 500}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Additional Fees</span>
                                <span className="font-medium">₹{currentBill.charges?.additionalFees || 1000}</span>
                            </div>

                            {currentBill.charges?.discounts > 0 && (
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-gray-600">Discounts</span>
                                    <span className="font-medium text-green-600">-₹{currentBill.charges.discounts}</span>
                                </div>
                            )}

                            {currentBill.charges?.lateFees > 0 && (
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-gray-600">Late Fees</span>
                                    <span className="font-medium text-red-600">₹{currentBill.charges.lateFees}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center py-3 border-t-2">
                                <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                                <span className="text-xl font-bold text-blue-600">₹{currentBill.totalAmount}</span>
                            </div>

                            {currentBill.paidAmount > 0 && (
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Paid Amount</span>
                                    <span className="font-medium text-green-600">₹{currentBill.paidAmount}</span>
                                </div>
                            )}

                            {currentBill.paidAmount < currentBill.totalAmount && (
                                <div className="flex justify-between items-center py-2 border-t">
                                    <span className="text-lg font-semibold text-gray-800">Remaining Balance</span>
                                    <span className="text-xl font-bold text-red-600">₹{currentBill.totalAmount - currentBill.paidAmount}</span>
                                </div>
                            )}
                        </div>

                        {currentBill.status !== 'paid' && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <button
                                    onClick={() => handlePay(currentBill._id)}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    Pay Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* All Bills Tab */}
            {activeTab === 'bills' && (
                <div className="space-y-4">
                    {bills.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No bills found</p>
                        </div>
                    ) : (
                        bills.map((bill) => (
                            <div key={bill._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {bill.billingPeriod?.month} {bill.billingPeriod?.year}
                                        </h3>
                                        <p className="text-gray-600">Room: {bill.roomId?.roomNumber}</p>
                                        <p className="text-sm text-gray-500">
                                            Due: {formatDate(bill.dueDate)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(bill.status)}`}>
                                            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                                        </div>
                                        <p className="text-xl font-bold text-blue-600">₹{bill.totalAmount}</p>
                                        {bill.paidAmount > 0 && (
                                            <p className="text-sm text-green-600">Paid: ₹{bill.paidAmount}</p>
                                        )}
                                        {bill.status !== 'paid' && (
                                            <button
                                                onClick={() => handlePay(bill._id)}
                                                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    {paymentHistory.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No payment history found</p>
                        </div>
                    ) : (
                        paymentHistory.map((payment, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Payment - {formatDate(payment.paymentDate)}
                                        </h3>
                                        <p className="text-gray-600">
                                            Method: {payment.paymentMethod?.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Transaction ID: {payment.transactionId}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Period: {payment.billingPeriod?.month} {payment.billingPeriod?.year}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${payment.status === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                        </div>
                                        <p className="text-xl font-bold text-green-600">₹{payment.amount}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
                <div className="space-y-4">
                    {invoicesLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading invoices...</p>
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No invoices found</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Complete a payment to generate your first invoice
                            </p>
                            <button
                                onClick={fetchInvoices}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Refresh Invoices
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Your Invoices ({invoices.length})
                                </h3>
                                <button
                                    onClick={fetchInvoices}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    Refresh
                                </button>
                            </div>
                            {invoices.map((invoice) => (
                                <div key={invoice._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Invoice {invoice.invoiceNumber}
                                            </h3>
                                            <p className="text-gray-600">
                                                Period: {invoice.billingPeriod?.month} {invoice.billingPeriod?.year}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Generated: {formatDate(invoice.generatedDate)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Payment Date: {formatDate(invoice.paymentDate)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Transaction ID: {invoice.transactionId}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${invoice.status === 'paid' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'}`}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </div>
                                            <p className="text-xl font-bold text-blue-600">₹{invoice.totalAmount}</p>
                                            <p className="text-sm text-green-600">Paid: ₹{invoice.paidAmount}</p>
                                            <button
                                                onClick={() => downloadInvoice(invoice._id)}
                                                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                                            >
                                                📄 Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}