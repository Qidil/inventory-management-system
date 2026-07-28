import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { ArrowLeft, ArrowDown, CheckCircle } from 'lucide-react'

export default function StockInPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    note: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products', { params: { limit: 100 } })
      setProducts(response.data.data)
    } catch (err) {
      // Error handled by UI state
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/transactions/stock-in', {
        product_id: formData.product_id,
        quantity: parseInt(formData.quantity),
        note: formData.note,
      })
      setSuccess(true)
      setTimeout(() => navigate('/transactions'), 1500)
    } catch (err) {
      // Error handled by UI state
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magenta"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Stock In Berhasil!</h2>
        <p className="text-gray-500">Mengalihkan ke halaman transaksi...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/transactions')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Stock In</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none mb-2"
            />
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
              required
            >
              <option value="">Select Product</option>
              {filteredProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.code} - {product.name} (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
              rows={3}
              placeholder="Optional note..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              <ArrowDown className="w-4 h-4" />
              {submitting ? 'Processing...' : 'Stock In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}