import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Plus, Pencil, Trash2, X, AlertTriangle } from 'lucide-react'

export default function UserManagementPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data.data)
    } catch (err) {
      // Error handled by UI state
    } finally {
      setLoading(false)
    }
  }

  const openModal = (userData = null) => {
    if (userData) {
      setEditingUser(userData)
      setFormData({
        name: userData.name,
        email: userData.email,
        password: '',
        role: userData.role,
      })
    } else {
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', role: 'staff' })
    }
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', role: 'staff' })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const payload = { ...formData }
      if (editingUser && !payload.password) {
        delete payload.password
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload)
      } else {
        await api.post('/users', payload)
      }
      fetchUsers()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return
    try {
      await api.delete(`/users/${userId}`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus user')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magenta"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-magenta hover:bg-magenta/90 text-white px-4 py-2 rounded-lg font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    u.role === 'admin' ? 'bg-magenta/10 text-magenta' : 'bg-cyan/10 text-cyan'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(u.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(u)}
                      className="p-2 text-gray-400 hover:text-cyan hover:bg-cyan/10 rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {u.id !== user.id && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">{editingUser ? 'Edit User' : 'Add User'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser ? '(leave empty to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
                  required={!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta/20 focus:border-magenta outline-none"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-magenta hover:bg-magenta/90 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}