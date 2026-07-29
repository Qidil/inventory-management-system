import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import { ArrowLeft, Edit } from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/products/${id}`)
      setProduct(response.data.data)
    } catch (error) {
      navigate('/products', { state: { error: 'Produk tidak ditemukan' } })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
  }

  const getStockBadge = () => {
    if (!product) return null
    if (product.stock === 0) {
      return <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 rounded">Out of Stock</span>
    }
    if (product.stock <= product.minimum_stock) {
      return <span className="px-3 py-1 text-sm font-semibold bg-amber-100 text-amber-700 rounded">Low Stock</span>
    }
    return <span className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded">In Stock</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magenta"></div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          {getStockBadge()}
        </div>
        <button
          onClick={() => navigate(`/products/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-magenta hover:bg-magenta-hover text-white rounded-lg font-semibold"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Code</p>
              <p className="font-mono text-gray-800">{product.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-800">{product.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-gray-800">{product.category?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Supplier</p>
              <p className="text-gray-800">{product.supplier?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-gray-800">{formatPrice(product.price)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock</p>
              <p className="text-gray-800">{product.stock} units</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Minimum Stock</p>
              <p className="text-gray-800">{product.minimum_stock} units</p>
            </div>
          </div>
          {product.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-800">{product.description}</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-l-magenta">
              <p className="text-sm text-gray-500">Current Stock</p>
              <p className="text-2xl font-bold text-magenta">{product.stock}</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-l-cyan">
              <p className="text-sm text-gray-500">Minimum Stock</p>
              <p className="text-2xl font-bold text-cyan">{product.minimum_stock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h2>
        {product.transactions?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {product.transactions?.slice(0, 10).map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          tx.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.user?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}