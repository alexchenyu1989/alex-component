import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ComponentPage from './pages/ComponentPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticlePage from './pages/ArticlePage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminComponentsPage from './pages/admin/AdminComponentsPage'
import AdminComponentFormPage from './pages/admin/AdminComponentFormPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminTagsPage from './pages/admin/AdminTagsPage'
import AdminArticlesPage from './pages/admin/AdminArticlesPage'
import AdminArticleFormPage from './pages/admin/AdminArticleFormPage'
import AdminArticleCategoriesPage from './pages/admin/AdminArticleCategoriesPage'

function App() {
  return (
    <Routes>
      {/* 前台 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/components/:slug" element={<ComponentPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />

      {/* 管理後台 */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="components" element={<AdminComponentsPage />} />
        <Route path="components/new" element={<AdminComponentFormPage />} />
        <Route path="components/:id/edit" element={<AdminComponentFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="tags" element={<AdminTagsPage />} />
        <Route path="articles" element={<AdminArticlesPage />} />
        <Route path="articles/new" element={<AdminArticleFormPage />} />
        <Route path="articles/:id/edit" element={<AdminArticleFormPage />} />
        <Route path="article-categories" element={<AdminArticleCategoriesPage />} />
      </Route>
    </Routes>
  )
}

export default App
