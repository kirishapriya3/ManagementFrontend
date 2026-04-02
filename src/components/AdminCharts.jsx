import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminCharts() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/billing/financial-overview?period=year",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const revenueData = chartData.historical?.map(item => ({
    period: item.period,
    revenue: item.revenue,
    expenses: item.expenses,
    profit: item.profit
  })) || [];

  const occupancyData = chartData.historical?.map(item => ({
    period: item.period,
    occupancy: item.occupancy
  })) || [];

  const profitMarginData = chartData.historical?.map(item => ({
    period: item.period,
    profitMargin: item.profitMargin
  })) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading charts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Revenue, Expenses & Profit Chart */}
      <div className="bg-white rounded-lg shadow-md border p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue, Expenses & Profit Trends</h3>
        <div className="h-80">
          <svg viewBox="0 0 900 300" className="w-full h-full">
            {/* Grid lines */}
            {[...Array(6)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="100"
                y1={50 + i * 40}
                x2="850"
                y2={50 + i * 40}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            {[...Array(7)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={100 + i * 100}
                y1="50"
                x2={100 + i * 100}
                y2="250"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {[...Array(6)].map((_, i) => (
              <text
                key={`y-${i}`}
                x="90"
                y={55 + i * 40}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {50000 - i * 10000}
              </text>
            ))}

            {/* X-axis labels */}
            {revenueData.map((item, i) => (
              <text
                key={`x-${i}`}
                x={100 + i * 100}
                y="270"
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {item.period}
              </text>
            ))}

            {/* Revenue line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              points={revenueData.map((item, i) =>
                `${100 + i * 100},${250 - (item.revenue / 50000) * 200}`
              ).join(' ')}
            />

            {/* Expenses line */}
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              points={revenueData.map((item, i) =>
                `${100 + i * 100},${250 - (item.expenses / 50000) * 200}`
              ).join(' ')}
            />

            {/* Profit line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={revenueData.map((item, i) =>
                `${100 + i * 100},${250 - (item.profit / 50000) * 200}`
              ).join(' ')}
            />

            {/* Data points */}
            {revenueData.map((item, i) => (
              <g key={`points-${i}`}>
                <circle
                  cx={100 + i * 100}
                  cy={250 - (item.revenue / 50000) * 200}
                  r="5"
                  fill="#10b981"
                />
                <circle
                  cx={100 + i * 100}
                  cy={250 - (item.expenses / 50000) * 200}
                  r="5"
                  fill="#ef4444"
                />
                <circle
                  cx={100 + i * 100}
                  cy={250 - (item.profit / 50000) * 200}
                  r="5"
                  fill="#3b82f6"
                />
              </g>
            ))}

            {/* Legend */}
            <g>
              <rect x="650" y="60" width="15" height="3" fill="#10b981" />
              <text x="670" y="65" className="text-xs fill-gray-700">Revenue</text>

              <rect x="650" y="80" width="15" height="3" fill="#ef4444" />
              <text x="670" y="85" className="text-xs fill-gray-700">Expenses</text>

              <rect x="650" y="100" width="15" height="3" fill="#3b82f6" />
              <text x="670" y="105" className="text-xs fill-gray-700">Profit</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Occupancy Rate Chart */}
      <div className="bg-white rounded-lg shadow-md border p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Occupancy Rate Trends</h3>
        <div className="h-64">
          <svg viewBox="0 0 900 200" className="w-full h-full">
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="100"
                y1={30 + i * 35}
                x2="850"
                y2={30 + i * 35}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            {[...Array(7)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={100 + i * 100}
                y1="30"
                x2={100 + i * 100}
                y2="165"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {[...Array(5)].map((_, i) => (
              <text
                key={`y-${i}`}
                x="90"
                y={35 + i * 35}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {100 - i * 25}%
              </text>
            ))}

            {/* X-axis labels */}
            {occupancyData.map((item, i) => (
              <text
                key={`x-${i}`}
                x={100 + i * 100}
                y="180"
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {item.period}
              </text>
            ))}

            {/* Occupancy bars */}
            {occupancyData.map((item, i) => (
              <rect
                key={`bar-${i}`}
                x={100 + i * 100 - 25}
                y={165 - (item.occupancy / 100) * 135}
                width="50"
                height={(item.occupancy / 100) * 135}
                fill="#8b5cf6"
                opacity="0.8"
              />
            ))}

            {/* Occupancy values on top of bars */}
            {occupancyData.map((item, i) => (
              <text
                key={`value-${i}`}
                x={100 + i * 100}
                y={160 - (item.occupancy / 100) * 135}
                textAnchor="middle"
                className="text-xs font-semibold fill-gray-700"
              >
                {item.occupancy}%
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Profit Margin Chart */}
      <div className="bg-white rounded-lg shadow-md border p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Profit Margin Trends</h3>
        <div className="h-64">
          <svg viewBox="0 0 900 200" className="w-full h-full">
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="100"
                y1={30 + i * 35}
                x2="850"
                y2={30 + i * 35}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            {[...Array(7)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={100 + i * 100}
                y1="30"
                x2={100 + i * 100}
                y2="165"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {[...Array(5)].map((_, i) => (
              <text
                key={`y-${i}`}
                x="90"
                y={35 + i * 35}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {50 - i * 12.5}%
              </text>
            ))}

            {/* X-axis labels */}
            {profitMarginData.map((item, i) => (
              <text
                key={`x-${i}`}
                x={100 + i * 100}
                y="180"
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {item.period}
              </text>
            ))}

            {/* Profit margin line */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              points={profitMarginData.map((item, i) =>
                `${100 + i * 100},${165 - (item.profitMargin / 50) * 135}`
              ).join(' ')}
            />

            {/* Data points */}
            {profitMarginData.map((item, i) => (
              <circle
                key={`point-${i}`}
                cx={100 + i * 100}
                cy={165 - (item.profitMargin / 50) * 135}
                r="5"
                fill="#f59e0b"
              />
            ))}

            {/* Values on points */}
            {profitMarginData.map((item, i) => (
              <text
                key={`value-${i}`}
                x={100 + i * 100}
                y={160 - (item.profitMargin / 50) * 135}
                textAnchor="middle"
                className="text-xs font-semibold fill-gray-700"
              >
                {item.profitMargin}%
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <h4 className="text-sm font-medium opacity-90">Total Revenue</h4>
          <p className="text-2xl font-bold mt-2">₹{chartData.revenue?.total?.toLocaleString() || 0}</p>
          <p className="text-xs mt-2 opacity-80">+12.5% from last year</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
          <h4 className="text-sm font-medium opacity-90">Total Expenses</h4>
          <p className="text-2xl font-bold mt-2">₹{chartData.expenses?.total?.toLocaleString() || 0}</p>
          <p className="text-xs mt-2 opacity-80">+8.2% from last year</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h4 className="text-sm font-medium opacity-90">Net Profit</h4>
          <p className="text-2xl font-bold mt-2">₹{chartData.profit?.net?.toLocaleString() || 0}</p>
          <p className="text-xs mt-2 opacity-80">+15.3% from last year</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <h4 className="text-sm font-medium opacity-90">Occupancy Rate</h4>
          <p className="text-2xl font-bold mt-2">{chartData.occupancy?.rate || 0}%</p>
          <p className="text-xs mt-2 opacity-80">{chartData.occupancy?.occupiedRooms || 0}/{chartData.occupancy?.totalRooms || 0} rooms</p>
        </div>
      </div>
    </div>
  );
}
