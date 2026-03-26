import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminFinancial() {
  const [financialData, setFinancialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const navigate = useNavigate();

  // Check admin role on component mount
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
      return;
    }
    fetchFinancialData();
  }, [navigate, selectedPeriod, selectedYear, selectedMonth]);

  const handleBack = () => {
    navigate("/admin");
  };

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://managementbackend-0njb.onrender.com/api/billing/financial-overview?period=${selectedPeriod}&year=${selectedYear}&month=${selectedMonth}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFinancialData(response.data);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

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
          <h1 className="text-3xl font-bold text-[#4B2E2B]">Financial Performance Dashboard</h1>
        </div>
        <div className="flex gap-4 items-center">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="day">Daily</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
          
          {selectedPeriod === 'month' && (
            <>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="border p-2 rounded"
              >
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border p-2 rounded"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </>
          )}
          
          {selectedPeriod === 'year' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border p-2 rounded"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}

          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={fetchFinancialData}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">₹{financialData.revenue?.total?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500 mt-2">
            {financialData.revenue?.growth > 0 ? '+' : ''}{financialData.revenue?.growth || 0}% from last period
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">₹{financialData.expenses?.total?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500 mt-2">
            {financialData.expenses?.growth > 0 ? '+' : ''}{financialData.expenses?.growth || 0}% from last period
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800">Net Profit</h3>
          <p className="text-3xl font-bold text-blue-600">₹{financialData.profit?.net?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500 mt-2">
            {financialData.profit?.growth > 0 ? '+' : ''}{financialData.profit?.growth || 0}% from last period
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800">Occupancy Rate</h3>
          <p className="text-3xl font-bold text-purple-600">{financialData.occupancy?.rate || 0}%</p>
          <p className="text-sm text-gray-500 mt-2">
            {financialData.occupancy?.occupiedRooms || 0}/{financialData.occupancy?.totalRooms || 0} rooms occupied
          </p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hostel Fees</span>
              <span className="font-semibold">₹{financialData.revenue?.hostelFees?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mess Fees</span>
              <span className="font-semibold">₹{financialData.revenue?.messFees?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Utilities</span>
              <span className="font-semibold">₹{financialData.revenue?.utilities?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Additional Fees</span>
              <span className="font-semibold">₹{financialData.revenue?.additionalFees?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Late Fees</span>
              <span className="font-semibold">₹{financialData.revenue?.lateFees?.toLocaleString() || 0}</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-gray-800 font-semibold">Total Revenue</span>
              <span className="font-bold text-green-600">₹{financialData.revenue?.total?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Expenses Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Staff Salaries</span>
              <span className="font-semibold">₹{financialData.expenses?.salaries?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Maintenance</span>
              <span className="font-semibold">₹{financialData.expenses?.maintenance?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Utilities</span>
              <span className="font-semibold">₹{financialData.expenses?.utilities?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Food & Supplies</span>
              <span className="font-semibold">₹{financialData.expenses?.food?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Other Expenses</span>
              <span className="font-semibold">₹{financialData.expenses?.other?.toLocaleString() || 0}</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-gray-800 font-semibold">Total Expenses</span>
              <span className="font-bold text-red-600">₹{financialData.expenses?.total?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Occupancy Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Occupancy Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Rooms</span>
              <span className="font-semibold">{financialData.occupancy?.totalRooms || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Occupied Rooms</span>
              <span className="font-semibold text-green-600">{financialData.occupancy?.occupiedRooms || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Vacant Rooms</span>
              <span className="font-semibold text-red-600">{financialData.occupancy?.vacantRooms || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Occupancy Rate</span>
              <span className="font-semibold text-purple-600">{financialData.occupancy?.rate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Potential Revenue (Full Occupancy)</span>
              <span className="font-semibold">₹{financialData.occupancy?.potentialRevenue?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Trends</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue Growth</span>
              <span className={`font-semibold ${financialData.trends?.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {financialData.trends?.revenueGrowth > 0 ? '+' : ''}{financialData.trends?.revenueGrowth || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profit Margin</span>
              <span className="font-semibold text-blue-600">{financialData.trends?.profitMargin || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cost per Occupied Room</span>
              <span className="font-semibold">₹{financialData.trends?.costPerRoom?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Revenue per Room</span>
              <span className="font-semibold">₹{financialData.trends?.avgRevenuePerRoom?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Collection Rate</span>
              <span className="font-semibold text-green-600">{financialData.trends?.collectionRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Historical Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financialData.historical?.map((period, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{period.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">₹{period.expenses.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">₹{period.profit.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">{period.occupancy}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period.profitMargin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!financialData.historical || financialData.historical.length === 0) && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No historical data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
