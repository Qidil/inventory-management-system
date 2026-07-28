import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { ArrowDown, ArrowUp, Filter } from 'lucide-react'

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [filters, setFilters] = useState({
    type: '',
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    fetchTransactions()
  }, [pagination.page, filters])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await api.get('/transactions', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          type: filters.type,
          start_date: filters.start_date,
          end_date: filters.end_date,
        },
      })
      setTransactions(response.data.data)
      setPagination(prev => ({ ...prev, total: response.data.meta.total }))
    } catch (err) {
      // Error handled by UI state
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
        <div className="flex gap-2">
          <Link
            to="/transactions/stock-in"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <ArrowDown className="w-4 h-4" />
            Stock In
          </Link>
          <Link
            to="/transactions/stock-out"
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <ArrowUp className="w-4 h-4" />
            Stock Out
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filters.type}
              onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPagination(prev => ({ ...prev, page: 1 })) }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
            >
              <option value="">All Types</option>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
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
          <button
            onClick={() => { setFilters({ type: '', start_date: '', end_date: '' }); setPagination(prev => ({ ...prev, page: 1 })) }}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No transactions found</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(tx.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
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
                  <td className="px-6 py-4 font-medium text-gray-800">{tx.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.user?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{tx.note || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}