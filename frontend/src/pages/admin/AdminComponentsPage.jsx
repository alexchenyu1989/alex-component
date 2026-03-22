import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, LayoutList, LayoutGrid } from 'lucide-react'
import api from '@/lib/axios'

export default function AdminComponentsPage() {
  const [components, setComponents] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table')

  const fetchComponents = (category = selectedCategory) => {
    setLoading(true)
    api.get('/admin/components', { params: category ? { category } : {} })
      .then((res) => setComponents(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data))
  }, [])

  useEffect(() => { fetchComponents(selectedCategory) }, [selectedCategory])

  const handleDelete = async (e, id) => {
    e.preventDefault()
    if (!confirm('確定刪除？')) return
    await api.delete(`/admin/components/${id}`)
    fetchComponents()
  }

  const handleSortChange = (id, value) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, sort_order: value } : c))
    )
  }

  const handleSortBlur = async (id, value) => {
    const num = parseInt(value, 10) || 0
    await api.put(`/admin/components/${id}`, { sort_order: num })
    fetchComponents()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">元件管理</h2>
          <p className="text-sm text-[#6B6B70] mt-0.5">管理所有 UI 特效元件</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-8 px-3 text-sm rounded-lg outline-none flex-1 sm:flex-none"
            style={{ background: '#141417', border: '1px solid #1F1F23', color: selectedCategory ? '#FFFFFF' : '#6B6B70' }}
          >
            <option value="">全部分類</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-[#141417] border border-[#1F1F23] rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className="p-1.5 rounded-md transition-colors"
              style={viewMode === 'table' ? { background: '#2A2A2E', color: '#FFFFFF' } : { color: '#6B6B70' }}
              title="列表模式"
            >
              <LayoutList size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="p-1.5 rounded-md transition-colors"
              style={viewMode === 'grid' ? { background: '#2A2A2E', color: '#FFFFFF' } : { color: '#6B6B70' }}
              title="卡片模式"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
          <Link
            to="/admin/components/new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}
          >
            <Plus size={15} /> 新增元件
          </Link>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#141417] border border-[#1F1F23] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-[#111113] border-b border-[#1F1F23]">
                <th className="text-left text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">標題</th>
                <th className="text-left text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">分類</th>
                <th className="text-left text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">標籤</th>
                <th className="text-left text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">狀態</th>
                <th className="text-center text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">排序</th>
                <th className="text-right text-xs font-semibold text-[#6B6B70] uppercase tracking-wider px-5 py-3.5">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F23]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center text-[#6B6B70] py-16 text-sm">載入中...</td>
                </tr>
              ) : components.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-[#6B6B70] py-16 text-sm">尚無元件，點擊右上角新增</td>
                </tr>
              ) : components.map((comp) => (
                <tr key={comp.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4 font-medium text-white">
                    <Link to={`/admin/components/${comp.id}/edit`} className="hover:text-[#FF5C00] transition-colors">
                      {comp.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    {comp.category && (
                      <span className="text-xs bg-white/8 text-[#8B8B90] px-2.5 py-1 rounded-full">{comp.category.name}</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {comp.tags?.slice(0, 3).map((tag) => (
                        <span key={tag.id} className="text-xs border border-[#2A2A2E] text-[#6B6B70] px-2 py-0.5 rounded-full">{tag.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      comp.is_published
                        ? 'bg-[#FF5C0018] text-[#FF5C00]'
                        : 'bg-white/5 text-[#6B6B70]'
                    }`}>
                      {comp.is_published ? '已上架' : '草稿'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <input
                      type="number"
                      value={comp.sort_order ?? 0}
                      onChange={(e) => handleSortChange(comp.id, e.target.value)}
                      onBlur={(e) => handleSortBlur(comp.id, e.target.value)}
                      className="w-16 rounded-md px-2 py-1 text-center text-sm font-mono text-white outline-none focus:border-[#FF5C00]/50"
                      style={{ background: '#1A1A1D', border: '1px solid #2A2A2E' }}
                      min={0}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/admin/components/${comp.id}/edit`}
                        className="p-2 text-[#6B6B70] hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={(e) => handleDelete(e, comp.id)}
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
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl h-64 animate-pulse" style={{ background: '#141417', border: '1px solid #1F1F23' }} />
            ))}
          </div>
        ) : components.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-sm" style={{ color: '#6B6B70' }}>尚無元件，點擊右上角新增</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {components.map((comp) => (
              <Link
                key={comp.id}
                to={`/admin/components/${comp.id}/edit`}
                className="rounded-xl overflow-hidden block"
                style={{ background: '#141417', border: '1px solid #1F1F23' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3A3A3E')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1F1F23')}
              >
                {/* Preview */}
                <div className="h-40 overflow-hidden relative" style={{ background: '#111113' }}>
                  <iframe
                    srcDoc={comp.preview_html}
                    className="w-full h-full pointer-events-none"
                    style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133%', height: '133%' }}
                    sandbox="allow-scripts"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, #141417 0%, transparent 60%)' }}
                  />
                  {/* Status Badge */}
                  <span
                    className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={comp.is_published
                      ? { background: '#FF5C0018', color: '#FF5C00' }
                      : { background: 'rgba(255,255,255,0.05)', color: '#6B6B70' }
                    }
                  >
                    {comp.is_published ? '已上架' : '草稿'}
                  </span>
                </div>

                {/* Info */}
                <div className="px-4 py-3.5" style={{ borderTop: '1px solid #1F1F23' }}>
                  <h3 className="text-sm font-medium text-white truncate">{comp.title}</h3>
                  {comp.description && (
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#6B6B70' }}>{comp.description}</p>
                  )}
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {comp.category && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: '#FF5C0015', color: '#FF5C00' }}
                      >
                        {comp.category.name}
                      </span>
                    )}
                    {comp.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag.id}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ border: '1px solid #2A2A2E', color: '#6B6B70' }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-1 mt-3 pt-3" style={{ borderTop: '1px solid #1F1F23' }}>
                    <Link
                      to={`/admin/components/${comp.id}/edit`}
                      className="p-1.5 text-[#6B6B70] hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                    >
                      <Pencil size={13} />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, comp.id)}
                      className="p-1.5 text-[#6B6B70] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}
