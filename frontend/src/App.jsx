import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ComponentPage from './pages/ComponentPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminComponentsPage from './pages/admin/AdminComponentsPage'
import AdminComponentFormPage from './pages/admin/AdminComponentFormPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminTagsPage from './pages/admin/AdminTagsPage'

function App() {
  return (
    <Routes>
      {/* 前台 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/components/:slug" element={<ComponentPage />} />

      {/* 管理後台 */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="components" element={<AdminComponentsPage />} />
        <Route path="components/new" element={<AdminComponentFormPage />} />
        <Route path="components/:id/edit" element={<AdminComponentFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="tags" element={<AdminTagsPage />} />
      </Route>
    </Routes>
  )
}

export default App
