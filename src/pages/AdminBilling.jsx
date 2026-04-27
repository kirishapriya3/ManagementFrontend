import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sendBillingReminder } from "../services/billingService";

export default function AdminBilling() {
  const [billingOverview, setBillingOverview] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [specificResident, setSpecificResident] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const residentId = searchParams.get('resident');

  // Check admin or staff role on component mount
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin" && role !== "staff") {
      navigate("/login");
      return;
    }
    fetchBillingOverview();
  }, [navigate]);

  const handleBack = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "staff") {
      navigate("/staff");
    }
  };

  const fetchBillingOverview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (residentId) {
        // Fetch specific resident's billing details
        console.log('Fetching billing for resident:', residentId);
        const response = await axios.get(
          `https://managementbackend-0njb.onrender.com/api/billing/${residentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log('Response:', response);
        console.log('Response data:', response.data);
        setSpecificResident(response.data);
      } else {
        // Fetch all residents billing overview
        const response = await axios.get(
          "https://managementbackend-0njb.onrender.com/api/billing/overview",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setBillingOverview(response.data);
      }
    } catch (error) {
      console.error("Error fetching billing overview:", error);
      console.error('Error details:', error.response?.data);
      if (residentId) {
        alert('Error fetching resident billing details. Please check the console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (resident) => {
    // Check if resident has already paid
    if (resident.totalDue === 0) {
      alert(`${resident.name} has already paid their bills. No reminder needed.`);
      return;
    }

    try {
      await sendBillingReminder({
        userId: resident.residentId,
        message: "Your bill is due, please pay as soon as possible"
      });
      alert(`Payment reminder sent to ${resident.name} at ${resident.email}`);
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("Error sending reminder");
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
          >
            Back
          </button>
          <h1 className="text-3xl text-[#4B2E2B] font-bold">
            {residentId ? 'Resident Billing Details' : 'Admin Billing Overview'}
          </h1>
        </div>
        <button
          className="bg-gray-500 text-white px-4 py-2"
          onClick={() => navigate('/residents')}
        >
          Back to List
        </button>
      </div>

      {residentId && specificResident ? (
        // Show specific resident billing details
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {specificResident.resident?.name || specificResident.name} - Billing Details
            </h2>
          </div>
          <div className="p-6">
            {/* Resident Information */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-[#4B2E2B] mb-3">Resident Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900 bg-white p-2 rounded">
                    {specificResident.resident?.name || specificResident.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 bg-white p-2 rounded">
                    {specificResident.resident?.email || specificResident.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <p className="text-gray-900 bg-white p-2 rounded">
                    {specificResident.resident?.roomNumber || specificResident.roomNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Bills List - Simplified View */}
            {specificResident.bills && specificResident.bills.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[#4B2E2B] mb-3">Payment Details</h3>
                <div className="space-y-4">
                  {specificResident.bills.map((bill) => (
                    <div key={bill._id} className="bg-white p-4 rounded border">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800">{bill.type || bill.description || 'Bill'}</h4>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${bill.amount}</p>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            bill.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bill.status === 'paid' ? 'PAID' : 'UNPAID'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bill.status === 'paid' ? (
                          // Show paid information
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Payment</label>
                              <p className="text-gray-900 bg-white p-2 rounded">
                                {bill.paidDate ? new Date(bill.paidDate).toLocaleDateString() : 'Not available'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                              <p className="text-gray-900 bg-white p-2 rounded font-bold">${bill.amount}</p>
                            </div>
                          </>
                        ) : (
                          // Show unpaid information
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date of Payment</label>
                              <p className="text-gray-900 bg-white p-2 rounded">
                                {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'Not set'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                              <p className="text-gray-900 bg-white p-2 rounded font-bold text-red-600">${bill.amount}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : billingOverview.stats && billingOverview.residents ? (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-800">Total Residents</h3>
              <p className="text-3xl font-bold text-blue-600">{billingOverview.stats.totalResidents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-800">Paid Residents</h3>
              <p className="text-3xl font-bold text-green-600">{billingOverview.stats.totalPaidResidents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-800">Unpaid Residents</h3>
              <p className="text-3xl font-bold text-red-600">{billingOverview.stats.totalUnpaidResidents}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">₹{billingOverview.stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Additional Stats
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <h3 className="text-sm font-semibold text-gray-600">Total Bills</h3>
              <p className="text-xl font-bold text-gray-800">{billingOverview.stats.totalBills}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <h3 className="text-sm font-semibold text-gray-600">Paid Bills</h3>
              <p className="text-xl font-bold text-green-600">{billingOverview.stats.totalPaidBills}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <h3 className="text-sm font-semibold text-gray-600">Outstanding Amount</h3>
              <p className="text-xl font-bold text-red-600">₹{billingOverview.stats.totalOutstanding.toLocaleString()}</p>
            </div>
          </div> */}

          {/* Residents List */}
          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Residents Payment Status</h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="na">N/A</option>
                  </select>
                </div>
              </div>
            </div>
            {billingOverview.residents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Send Reminder</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {billingOverview.residents
                      .filter((resident) => {
                        if (statusFilter === 'all') return true;
                        if (statusFilter === 'paid') return resident.totalDue === 0 && resident.roomNumber !== 'N/A';
                        if (statusFilter === 'unpaid') return resident.totalDue > 0 && resident.roomNumber !== 'N/A';
                        if (statusFilter === 'na') return resident.roomNumber === 'N/A';
                        return true;
                      })
                      .map((resident) => (
                      <tr key={resident.residentId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                            <div className="text-sm text-gray-500">{resident.email}</div>
                            <div className="text-xs text-gray-400">{resident.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.roomNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            resident.roomNumber === 'N/A'
                              ? 'bg-gray-100 text-gray-800'
                              : resident.totalDue === 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {resident.roomNumber === 'N/A' ? 'N/A' : resident.totalDue === 0 ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedResident(resident)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {resident.totalDue > 0 && (
                            <button
                              onClick={() => sendReminder(resident)}
                              className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors"
                            >
                              Send Reminder
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No residents with billing data found</p>
                <p className="text-sm text-gray-400 mt-2">Create some bills for residents to see their payment status</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md border p-8">
          <p className="text-gray-500 text-center">
            {loading ? 'Loading billing data...' : 'No billing data available'}
          </p>
        </div>
      )}

      {/* Details Modal */}
      {selectedResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#4B2E2B]">Resident Billing Details</h2>
              <button
                onClick={() => setSelectedResident(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Resident Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[#4B2E2B] mb-3">Resident Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900 bg-white p-2 rounded">{selectedResident.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900 bg-white p-2 rounded">{selectedResident.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900 bg-white p-2 rounded">{selectedResident.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                    <p className="text-gray-900 bg-white p-2 rounded">{selectedResident.roomNumber}</p>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-[#4B2E2B] mb-3">Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Bills</label>
                    <p className="text-gray-900 bg-white p-2 rounded text-center font-semibold">{selectedResident.totalBills}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paid Bills</label>
                    <p className="text-gray-900 bg-white p-2 rounded text-center font-semibold">{selectedResident.paidBills}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                    <p className="text-gray-900 bg-white p-2 rounded text-center font-semibold">₹{selectedResident.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                    <p className="text-green-600 bg-white p-2 rounded text-center font-semibold">₹{selectedResident.totalPaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Amount</label>
                    <p className="text-red-600 bg-white p-2 rounded text-center font-semibold">₹{selectedResident.totalDue.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="bg-white p-2 rounded text-center">
                      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                        selectedResident.roomNumber === 'N/A'
                          ? 'bg-gray-100 text-gray-800'
                          : selectedResident.totalDue === 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {selectedResident.roomNumber === 'N/A' ? 'N/A' : selectedResident.totalDue === 0 ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {selectedResident.totalDue > 0 && (
                  <button
                    onClick={() => {
                      sendReminder(selectedResident);
                      setSelectedResident(null);
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                  >
                    Send Reminder
                  </button>
                )}
                <button
                  onClick={() => setSelectedResident(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
