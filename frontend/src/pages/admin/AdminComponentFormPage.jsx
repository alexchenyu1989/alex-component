import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '@/lib/axios'

export default function AdminComponentFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    preview_html: '',
    markdown_content: '',
    prompt: '',
    category_id: '',
    is_published: true,
    tags: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data))
    api.get('/tags').then((res) => setTags(res.data))

    if (isEdit) {
      api.get('/admin/components').then((res) => {
        const component = res.data.data.find((item) => item.id === parseInt(id, 10))

        if (!component) return

        setForm({
          title: component.title,
          description: component.description || '',
          preview_html: component.preview_html,
          markdown_content: component.markdown_content,
          prompt: component.prompt || '',
          category_id: component.category_id ? String(component.category_id) : '',
          is_published: component.is_published,
          tags: component.tags.map((tag) => tag.id),
        })
      })
    }
  }, [id, isEdit])

  const handleTagToggle = (tagId) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((item) => item !== tagId)
        : [...prev.tags, tagId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isEdit) {
        await api.put(`/admin/components/${id}`, form)
      } else {
        await api.post('/admin/components', form)
      }

      navigate('/admin/components')
    } catch (err) {
      const data = err.response?.data

      if (data?.errors) {
        setError(Object.values(data.errors).flat().join(' / '))
      } else {
        setError(data?.message || `Save failed (HTTP ${err.response?.status ?? 'unknown'})`)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-[#2A2A2E] bg-[#1A1A1D] px-4 py-2.5 text-sm text-white placeholder:text-[#6B6B70] transition-colors focus:border-[#FF5C00]/50 focus:outline-none'
  const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6B6B70]'
  const panelClass = 'rounded-xl border border-[#1F1F23] bg-[#141417] p-5'

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">{isEdit ? '編輯元件' : '新增元件'}</h2>
        <p className="mt-0.5 text-sm text-[#6B6B70]">管理元件內容、標籤與發佈狀態。</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className={`${panelClass} space-y-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70]">基本資料</p>

            <div>
              <label className={labelClass}>標題</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="請輸入元件標題"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>描述</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="請輸入這個元件的簡短說明"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>分類</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className={inputClass}
              >
                <option value="">請選擇分類</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className={`${panelClass} space-y-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70]">內容設定</p>

            <div>
              <label className={labelClass}>Preview HTML</label>
              <p className="mb-2 text-xs text-[#6B6B70]">貼上用來顯示元件預覽的 HTML。</p>
              <textarea
                value={form.preview_html}
                onChange={(e) => setForm({ ...form, preview_html: e.target.value })}
                rows={8}
                className={`${inputClass} resize-y font-mono text-xs`}
                required
              />
            </div>

            {form.preview_html && (
              <div>
                <label className={labelClass}>預覽畫面</label>
                <div className="h-56 overflow-hidden rounded-xl border border-[#2A2A2E]">
                  <iframe srcDoc={form.preview_html} className="h-full w-full" sandbox="allow-scripts" />
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>Markdown 內容</label>
              <p className="mb-2 text-xs text-[#6B6B70]">下載時輸出的 Markdown 文字內容。</p>
              <textarea
                value={form.markdown_content}
                onChange={(e) => setForm({ ...form, markdown_content: e.target.value })}
                rows={8}
                className={`${inputClass} resize-y font-mono text-xs`}
              />
            </div>

            <div>
              <label className={labelClass}>Prompt</label>
              <p className="mb-2 text-xs text-[#6B6B70]">可選填，記錄這個元件使用的 AI Prompt。</p>
              <textarea
                value={form.prompt}
                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-5 self-start xl:sticky xl:top-6">
          <section className={`${panelClass} space-y-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70]">標籤設定</p>

            <div>
              <label className={labelClass}>標籤選擇</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      form.tags.includes(tag.id)
                        ? 'border-[#FF5C00]/30 bg-[#FF5C0018] text-[#FF5C00]'
                        : 'border-[#2A2A2E] bg-white/5 text-[#8B8B90] hover:text-white'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, is_published: !form.is_published })}
                className={`relative h-5 w-10 rounded-full transition-colors ${form.is_published ? 'bg-[#FF5C00]' : 'bg-[#2A2A2E]'}`}
                aria-label="切換發佈狀態"
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                    form.is_published ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
              <span className="text-sm text-[#8B8B90]">已發佈</span>
            </div>
          </section>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <section className={`${panelClass} space-y-3`}>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}
            >
              {loading ? '儲存中...' : '儲存變更'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/components')}
              className="w-full rounded-lg border border-[#2A2A2E] bg-white/5 px-6 py-2.5 text-sm font-medium text-[#8B8B90] transition-colors hover:text-white"
            >
              返回列表
            </button>
          </section>
        </aside>
      </form>
    </div>
  )
}
