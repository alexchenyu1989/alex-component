import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import api from '@/lib/axios'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')

  const fetch = () => api.get('/categories').then((res) => setCategories(res.data))
  useEffect(() => { fetch() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    if (!newName.trim()) return
    try {
      await api.post('/admin/categories', { name: newName.trim() })
      setNewName('')
      fetch()
    } catch (err) {
      setError(err.response?.data?.message || '新增分類失敗')
    }
  }

  const handleUpdate = async (id) => {
    setError('')
    if (!editName.trim()) return
    try {
      await api.put(`/admin/categories/${id}`, { name: editName.trim() })
      setEditId(null)
      fetch()
    } catch (err) {
      setError(err.response?.data?.message || '更新分類失敗')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('確定刪除？')) return
    await api.delete(`/admin/categories/${id}`)
    fetch()
  }

  const inputClass = "flex-1 px-4 py-2.5 text-sm bg-[#1A1A1D] border border-[#2A2A2E] rounded-lg text-white placeholder:text-[#6B6B70] focus:outline-none focus:border-[#FF5C00]/50 transition-colors"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">分類管理</h2>
        <p className="text-sm text-[#6B6B70] mt-0.5">管理元件分類</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input value={newName} onChange={(e) => setNewName(e.target.value)}
          placeholder="新增分類名稱..." className={inputClass} />
        <button type="submit"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}>
          <Plus size={14} /> 新增
        </button>
      </form>

      <div className="bg-[#141417] border border-[#1F1F23] rounded-xl overflow-hidden">
        {error && (
          <p className="border-b border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400">
            {error}
          </p>
        )}
        {categories.length === 0 ? (
          <p className="text-sm text-[#6B6B70] text-center py-12">尚無分類</p>
        ) : (
          <ul className="divide-y divide-[#1F1F23]">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-3 px-5 py-3.5">
                {editId === cat.id ? (
                  <>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm bg-[#1A1A1D] border border-[#2A2A2E] rounded-lg text-white focus:outline-none focus:border-[#FF5C00]/50"
                      autoFocus />
                    <button type="button" onClick={() => handleUpdate(cat.id)} className="p-1.5 text-[#FF5C00] hover:bg-[#FF5C0018] rounded-lg transition-colors">
                      <Check size={14} />
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="p-1.5 text-[#6B6B70] hover:bg-white/5 rounded-lg transition-colors">
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium text-white">{cat.name}</span>
                    <span className="text-xs text-[#6B6B70] font-mono">{cat.slug}</span>
                    <button type="button" onClick={() => { setEditId(cat.id); setEditName(cat.name) }}
                      className="p-1.5 text-[#6B6B70] hover:text-white hover:bg-white/8 rounded-lg transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button type="button" onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-[#6B6B70] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
