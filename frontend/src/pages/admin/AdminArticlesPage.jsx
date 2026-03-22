import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import api from '@/lib/axios'

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchArticles = () => {
    setLoading(true)
    api.get('/admin/articles')
      .then((res) => setArticles(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchArticles() }, [])

  const handleDelete = async (e, id) => {
    e.preventDefault()
    if (!confirm('確定刪除？')) return
    await api.delete(`/admin/articles/${id}`)
    fetchArticles()
  }

  const handleSortChange = (id, value) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, sort_order: value } : a))
    )
  }

  const handleSortBlur = async (id, value) => {
    const num = parseInt(value, 10) || 0
    await api.put(`/admin/articles/${id}`, { sort_order: num })
    fetchArticles()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">文章管理</h2>
          <p className="text-sm text-[#6B6B70] mt-0.5">管理所有教學文章</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90 self-start"
          style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}
        >
          <Plus size={15} /> 新增文章
        </Link>
      </div>

      <div className="bg-[#141417] border border-[#1F1F23] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="bg-[#111113] border-b border-[#1F1F23]">
              <th className="text-left text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">標題</th>
              <th className="text-left text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">分類</th>
              <th className="text-left text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">狀態</th>
              <th className="text-center text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">排序</th>
              <th className="text-right text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F1F23]">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-[#6B6B70] py-16 text-sm">載入中...</td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-[#6B6B70] py-16 text-sm">尚無文章，點擊右上角新增</td>
              </tr>
            ) : articles.map((article) => (
              <tr key={article.id} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-4 font-medium text-white max-w-xs">
                  <Link to={`/admin/articles/${article.id}/edit`} className="hover:text-[#FF5C00] transition-colors line-clamp-1">
                    {article.title}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  {article.category && (
                    <span className="text-xs bg-white/8 text-[#8B8B90] px-2.5 py-1 rounded-full">{article.category.name}</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    article.is_published
                      ? 'bg-[#FF5C0018] text-[#FF5C00]'
                      : 'bg-white/5 text-[#6B6B70]'
                  }`}>
                    {article.is_published ? '已上架' : '草稿'}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <input
                    type="number"
                    value={article.sort_order ?? 0}
                    onChange={(e) => handleSortChange(article.id, e.target.value)}
                    onBlur={(e) => handleSortBlur(article.id, e.target.value)}
                    className="w-16 rounded-md px-2 py-1 text-center text-sm font-mono text-white outline-none focus:border-[#FF5C00]/50"
                    style={{ background: '#1A1A1D', border: '1px solid #2A2A2E' }}
                    min={0}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      to={`/admin/articles/${article.id}/edit`}
                      className="p-2 text-[#6B6B70] hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                    >
                      <Pencil size={13} />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, article.id)}
                      className="p-2 text-[#6B6B70] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
