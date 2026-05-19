import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import AdminLayout from './components/AdminLayout.jsx'
import Login from './pages/Login.jsx'
import Products from './pages/Products.jsx'
import ProductEdit from './pages/ProductEdit.jsx'
import Settings from './pages/Settings.jsx'
import { isLoggedIn } from './api.js'

function ProtectedRoute() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/produkte" replace />} />
          <Route path="/produkte" element={<Products />} />
          <Route path="/produkte/neu" element={<ProductEdit />} />
          <Route path="/produkte/:id/bearbeiten" element={<ProductEdit />} />
          <Route path="/einstellungen" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/produkte" replace />} />
    </Routes>
  )
}
