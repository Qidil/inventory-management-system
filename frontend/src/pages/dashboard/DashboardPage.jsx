import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Package, Tags, TrendingUp, TrendingDown, AlertTriangle, XCircle } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/transactions/dashboard')
      setDashboard(response.data.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-80 bg-white rounded-lg animate-pulse" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Products', value: dashboard?.total_products || 0, icon: Package, color: 'bg-pink-500' },
    { label: 'Categories', value: dashboard?.total_categories || 0, icon: Tags, color: 'bg-cyan-500' },
    { label: 'Stock In Today', value: dashboard?.stock_in_today || 0, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Stock Out Today', value: dashboard?.stock_out_today || 0, icon: TrendingDown, color: 'bg-red-500' },
  ]

  const chartData = {
    labels: dashboard?.chart_7_days?.map(d => d.date) || [],
    datasets: [
      {
        label: 'Stock In',
        data: dashboard?.chart_7_days?.map(d => d.in) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Stock Out',
        data: dashboard?.chart_7_days?.map(d => d.out) || [],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-4 bg-white rounded-lg shadow border-l-4 border-l-magenta flex items-center gap-4"
          >
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm text-gray-500">Low Stock Products</p>
              <p className="text-2xl font-bold text-amber-500">{dashboard?.low_stock_products || 0}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Out of Stock Products</p>
              <p className="text-2xl font-bold text-red-500">{dashboard?.out_of_stock_products || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Activity (Last 7 Days)</h2>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {dashboard?.recent_activities?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activities</p>
          ) : (
            dashboard?.recent_activities?.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      activity.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {activity.type}
                  </span>
                  <span className="text-gray-700">{activity.product}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium">{activity.quantity}</span>
                  <span>{activity.user}</span>
                  <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}