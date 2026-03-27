import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            setError('No session ID found');
            setLoading(false);
            return;
        }

        handlePaymentSuccess(sessionId);
    }, [searchParams]);

    const handlePaymentSuccess = async (sessionId) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError('Please log in to view payment details');
                setLoading(false);
                return;
            }

            const res = await axios.get(
                `https://managementbackend-0njb.onrender.com/api/payment/success?session_id=${sessionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data.invoice) {
                setInvoice(res.data.invoice);
            }

        } catch (error) {
            console.error('Error processing payment success:', error);
            setError('Payment processed successfully, but there was an issue generating the invoice.');
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = async (invoiceId) => {
        try {
            const token = localStorage.getItem("token");
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

    const goToInvoices = () => {
        navigate('/payment', { state: { activeTab: 'invoices' } });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Processing payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            🎉 Payment Successful!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your payment has been processed successfully.
                        </p>
                    </div>

                    {invoice ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">
                                    Invoice Generated
                                </h3>
                                <p className="text-green-700 text-sm mb-3">
                                    Invoice {invoice.invoiceNumber} has been created successfully.
                                </p>
                                <button
                                    onClick={() => downloadInvoice(invoice.id)}
                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2"
                                >
                                    📄 Download Invoice
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {error ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-yellow-800 text-sm">{error}</p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-blue-800 text-sm">
                                        Your invoice is being generated. Check the Invoices tab in a few moments.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={goToInvoices}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                        >
                            📄 View All Invoices
                        </button>
                        <button
                            onClick={() => navigate('/payment')}
                            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                        >
                            Back to Billing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
