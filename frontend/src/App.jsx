import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/auth/LoginPage'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magenta"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<div className="text-gray-700">Dashboard Page - Coming Soon</div>} />
        
        {/* Master Data */}
        <Route path="products" element={<div className="text-gray-700">Products Page - Coming Soon</div>} />
        <Route path="categories" element={<div className="text-gray-700">Categories Page - Coming Soon</div>} />
        <Route path="suppliers" element={<div className="text-gray-700">Suppliers Page - Coming Soon</div>} />
        
        {/* Transactions */}
        <Route path="transactions" element={<div className="text-gray-700">Transactions Page - Coming Soon</div>} />
        
        {/* Admin only */}
        <Route
          path="reports"
          element={
            <ProtectedRoute adminOnly>
              <div className="text-gray-700">Reports Page - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute adminOnly>
              <div className="text-gray-700">Users Page - Coming Soon</div>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App