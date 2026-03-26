import { useState, useEffect } from "react";
import { sendMaintenanceUpdate } from "../services/maintenanceService";
import { allocateRoom } from "../services/roomService";
import { sendBillingReminder } from "../services/billingService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminCharts from "../components/AdminCharts";

export default function AdminDashboard() {

  const [userId,setUserId] = useState("");
  const [billingOverview, setBillingOverview] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch billing overview on component mount
  useEffect(() => {
    fetchBillingOverview();
  }, []);

  const fetchBillingOverview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/billing/overview",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBillingOverview(response.data);
    } catch (error) {
      console.error("Error fetching billing overview:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenance = async () => {
    await sendMaintenanceUpdate({
      userId,
      issue: "AC not working",
      status: "In Progress"
    });

    alert("Maintenance email sent");
  };

  const handleRoom = async () => {
    await allocateRoom({
      userId,
      roomNumber: "203"
    });

    alert("Room allocation email sent");
  };

  const handleBilling = () => {
    navigate('/billing');
  };

  return (

    <div className="p-10">

      <h1 className="text-3xl text-[#4B2E2B] font-bold mb-6">
        Hostel Admin Dashboard
      </h1>

      <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleBilling}
        >
          Send Billing Reminder
        </button>

      {/* <input
        type="text"
        placeholder="Enter Resident MongoDB ID"
        className="border p-2 mr-4"
        onChange={(e)=>setUserId(e.target.value)}
      /> */}

      {/* <div className="space-x-4 mt-5">

        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleMaintenance}
        >
          Send Maintenance Update
        </button>

        <button
          className="bg-green-500 text-white px-4 py-2"
          onClick={handleRoom}
        >
          Allocate Room
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2"
          onClick={handleBilling}
        >
          Send Billing Reminder
        </button>

        <button
          className="bg-purple-500 text-white px-4 py-2"
          onClick={() => navigate('/billing')}
        >
          View Billing Overview
        </button>

      </div> */}

      {/* Financial Charts Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-[#4B2E2B] font-bold">Financial Performance Charts</h2>
        </div>
        <AdminCharts />
      </div>

      {/* Billing Overview Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Billing Overview</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={fetchBillingOverview}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {billingOverview.stats && billingOverview.residents ? (
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

            {/* Additional Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <h3 className="text-xl font-semibold text-gray-800">Residents Payment Status</h3>
              </div>
              {billingOverview.residents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bills</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Bills</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {billingOverview.residents.map((resident) => (
                        <tr key={resident.residentId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                              <div className="text-sm text-gray-500">{resident.email}</div>
                              <div className="text-xs text-gray-400">{resident.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.roomNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.totalBills}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.paidBills}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{resident.totalAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{resident.totalPaid.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">₹{resident.totalDue.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              resident.totalDue === 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {resident.totalDue === 0 ? 'Paid' : 'Unpaid'}
                            </span>
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
      </div>

    </div>
  );
}