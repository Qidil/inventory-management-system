import { useState, useEffect } from 'react'
import api from '../../services/api'
import { TrendingUp, TrendingDown, ArrowRightLeft, Filter } from 'lucide-react'

export default function ReportsPage() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    type: 'all',
  })

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await api.get('/transactions/reports', {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
          type: filters.type,
        },
      })
      setReport(response.data.data)
    } catch (err) {
      // Error handled by UI state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [filters])

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reports</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="stock_in">Stock In Only</option>
              <option value="stock_out">Stock Out Only</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-green-500">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Total Stock In</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(report.summary.total_in)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-red-500">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Total Stock Out</p>
                <p className="text-2xl font-bold text-red-600">{formatNumber(report.summary.total_out)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-magenta">
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="w-8 h-8 text-magenta" />
              <div>
                <p className="text-sm text-gray-500">Net Change</p>
                <p className={`text-2xl font-bold ${report.summary.net_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {report.summary.net_change >= 0 ? '+' : ''}{formatNumber(report.summary.net_change)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Transaction Details ({report?.summary?.transaction_count || 0} transactions)
          </h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : report?.transactions?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No transactions found</td>
              </tr>
            ) : (
              report?.transactions?.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(tx.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{tx.product?.name}</p>
                    <p className="text-xs text-gray-500">{tx.product?.code}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        tx.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{formatNumber(tx.quantity)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.user?.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}