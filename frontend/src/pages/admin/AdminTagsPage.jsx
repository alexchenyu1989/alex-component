import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import api from '@/lib/axios'

export default function AdminTagsPage() {
  const [tags, setTags] = useState([])
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')

  const fetch = () => api.get('/tags').then((res) => setTags(res.data))
  useEffect(() => { fetch() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    if (!newName.trim()) return
    try {
      await api.post('/admin/tags', { name: newName.trim() })
      setNewName('')
      fetch()
    } catch (err) {
      setError(err.response?.data?.message || '新增標籤失敗')
    }
  }

  const handleUpdate = async (id) => {
    setError('')
    if (!editName.trim()) return
    try {
      await api.put(`/admin/tags/${id}`, { name: editName.trim() })
      setEditId(null)
      fetch()
    } catch (err) {
      setError(err.response?.data?.message || '更新標籤失敗')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('確定刪除？')) return
    await api.delete(`/admin/tags/${id}`)
    fetch()
  }

  const inputClass = "flex-1 px-4 py-2.5 text-sm bg-[#1A1A1D] border border-[#2A2A2E] rounded-lg text-white placeholder:text-[#6B6B70] focus:outline-none focus:border-[#FF5C00]/50 transition-colors"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">標籤管理</h2>
        <p className="text-sm text-[#6B6B70] mt-0.5">管理元件標籤</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input value={newName} onChange={(e) => setNewName(e.target.value)}
          placeholder="新增標籤名稱..." className={inputClass} />
        <button type="submit"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}>
          <Plus size={14} /> 新增
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {error && (
          <p className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}
        {tags.length === 0 ? (
          <p className="text-sm text-[#6B6B70] w-full text-center py-12">尚無標籤</p>
        ) : tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-1 bg-[#141417] border border-[#2A2A2E] rounded-full pl-3.5 pr-1.5 py-1.5">
            {editId === tag.id ? (
              <>
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="text-xs w-20 focus:outline-none bg-transparent text-white" autoFocus />
                <button onClick={() => handleUpdate(tag.id)} className="p-0.5 text-[#FF5C00] hover:bg-[#FF5C0018] rounded-full transition-colors">
                  <Check size={11} />
                </button>
                <button onClick={() => setEditId(null)} className="p-0.5 text-[#6B6B70] hover:bg-white/5 rounded-full transition-colors">
                  <X size={11} />
                </button>
              </>
            ) : (
              <>
                <span className="text-sm text-[#8B8B90]">{tag.name}</span>
                <button onClick={() => { setEditId(tag.id); setEditName(tag.name) }}
                  className="p-1 text-[#6B6B70] hover:text-white rounded-full transition-colors ml-0.5">
                  <Pencil size={10} />
                </button>
                <button onClick={() => handleDelete(tag.id)}
                  className="p-1 text-[#6B6B70] hover:text-red-400 rounded-full transition-colors">
                  <Trash2 size={10} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
