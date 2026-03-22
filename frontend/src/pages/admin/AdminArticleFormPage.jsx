import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ImagePlus, Copy, Trash2, Check } from 'lucide-react'
import api from '@/lib/axios'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export default function AdminArticleFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    article_category_id: '',
    is_published: true,
    sort_order: 0,
    cover_image: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])      // 已上傳的圖片 URL 清單
  const [uploading, setUploading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState('')

  useEffect(() => {
    api.get('/article-categories').then((res) => setCategories(res.data))

    if (isEdit) {
      api.get('/admin/articles').then((res) => {
        const article = res.data.data.find((a) => a.id === parseInt(id, 10))
        if (!article) return
        setForm({
          title: article.title,
          excerpt: article.excerpt || '',
          content: article.content || '',
          article_category_id: article.article_category_id ? String(article.article_category_id) : '',
          is_published: article.is_published,
          sort_order: article.sort_order ?? 0,
          cover_image: article.cover_image || '',
        })
        setImages(Array.isArray(article.images) ? article.images : [])
      })
    }
  }, [id, isEdit])

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert('請先設定 Cloudinary 環境變數')
      return
    }
    setUploading(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      setImages((prev) => [json.secure_url, ...prev])
    } catch {
      alert('圖片上傳失敗')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleUploadCover = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert('請先設定 Cloudinary 環境變數')
      return
    }
    setUploadingCover(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      setForm((prev) => ({ ...prev, cover_image: json.secure_url }))
    } catch {
      alert('封面圖上傳失敗')
    } finally {
      setUploadingCover(false)
      e.target.value = ''
    }
  }

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(''), 2000)
  }

  const handleRemoveImage = (url) => {
    setImages((prev) => prev.filter((u) => u !== url))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, article_category_id: form.article_category_id || null, images }
      if (isEdit) {
        await api.put(`/admin/articles/${id}`, payload)
      } else {
        await api.post('/admin/articles', payload)
      }
      navigate('/admin/articles')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setError(Object.values(data.errors).flat().join(' / '))
      } else {
        setError(data?.message || `儲存失敗 (HTTP ${err.response?.status ?? 'unknown'})`)
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
        <h2 className="text-xl font-semibold text-white">{isEdit ? '編輯文章' : '新增文章'}</h2>
        <p className="mt-0.5 text-sm text-[#6B6B70]">編輯文章內容與發佈設定。</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main */}
        <div className="space-y-5">

          {/* 基本資料 */}
          <section className={`${panelClass} space-y-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70]">基本資料</p>
            <div>
              <label className={labelClass}>標題</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="請輸入文章標題"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>摘要</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="請輸入文章摘要（選填，顯示在列表卡片）"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          {/* HTML 內容 */}
          <section className={`${panelClass} space-y-3`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70]">文章內容（HTML）</p>
            <p className="text-xs text-[#6B6B70]">直接貼入 HTML 原始碼，可搭配下方圖片管理複製圖片連結使用。</p>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="<h2>標題</h2><p>內文...</p>"
              rows={16}
              className={`${inputClass} resize-y font-mono text-xs`}
              spellCheck={false}
            />
          </section>

          {/* 圖片管理 */}
          <section className={`${panelClass} space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70]">圖片管理</p>
                <p className="text-xs text-[#6B6B70] mt-1">上傳圖片後複製連結，貼到 HTML 的 img src 使用。</p>
              </div>
              <label className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white rounded-lg cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}>
                <ImagePlus size={14} />
                {uploading ? '上傳中...' : '上傳圖片'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                  disabled={uploading}
                />
              </label>
            </div>

            {images.length === 0 ? (
              <div
                className="rounded-lg flex items-center justify-center py-10 text-xs text-[#6B6B70]"
                style={{ border: '1px dashed #2A2A2E' }}
              >
                尚未上傳任何圖片
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((url) => (
                  <div
                    key={url}
                    className="rounded-lg overflow-hidden relative group"
                    style={{ border: '1px solid #2A2A2E' }}
                  >
                    <img src={url} alt="" className="w-full h-28 object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(url)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                        style={{ background: copiedUrl === url ? '#22c55e' : '#FF5C00' }}
                        title="複製圖片連結"
                      >
                        {copiedUrl === url ? <Check size={12} /> : <Copy size={12} />}
                        {copiedUrl === url ? '已複製' : '複製連結'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(url)}
                        className="p-1.5 rounded-lg text-white hover:bg-red-500/80 transition-colors"
                        title="從列表移除"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 self-start xl:sticky xl:top-6">

          {/* 封面圖 */}
          <section className={`${panelClass} space-y-3`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70]">封面圖</p>
              <label className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white rounded-lg cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}>
                <ImagePlus size={12} />
                {uploadingCover ? '上傳中...' : '上傳封面'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadCover}
                  disabled={uploadingCover}
                />
              </label>
            </div>
            {form.cover_image ? (
              <div className="relative group rounded-lg overflow-hidden" style={{ border: '1px solid #2A2A2E' }}>
                <img src={form.cover_image} alt="封面圖" className="w-full object-cover" style={{ maxHeight: '160px' }} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, cover_image: '' }))}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500/80 hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                    移除封面
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="rounded-lg flex items-center justify-center py-8 text-xs text-[#6B6B70]"
                style={{ border: '1px dashed #2A2A2E' }}
              >
                尚未設定封面圖
              </div>
            )}
          </section>

          <section className={`${panelClass} space-y-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70]">發佈設定</p>

            <div>
              <label className={labelClass}>分類</label>
              <select
                value={form.article_category_id}
                onChange={(e) => setForm({ ...form, article_category_id: e.target.value })}
                className={inputClass}
              >
                <option value="">不指定分類</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>排序數字</label>
              <p className="mb-1.5 text-xs text-[#6B6B70]">數字越大排越前面，預設為 0</p>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })}
                className={inputClass}
                min={0}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, is_published: !form.is_published })}
                className={`relative h-5 w-10 rounded-full transition-colors ${form.is_published ? 'bg-[#FF5C00]' : 'bg-[#2A2A2E]'}`}
                aria-label="切換發佈狀態"
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${form.is_published ? 'left-5' : 'left-0.5'}`} />
              </button>
              <span className="text-sm text-[#8B8B90]">已發佈</span>
            </div>
          </section>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
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
              onClick={() => navigate('/admin/articles')}
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
