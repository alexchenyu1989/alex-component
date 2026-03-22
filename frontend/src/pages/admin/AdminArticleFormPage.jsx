import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import api from '@/lib/axios'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="px-2 py-1 rounded text-xs font-medium transition-colors"
      style={active
        ? { background: '#FF5C0020', color: '#FF5C00' }
        : { color: '#8B8B90', background: 'transparent' }
      }
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#ffffff10' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

function EditorToolbar({ editor, onImageUpload, sourceMode, onToggleSource }) {
  if (!editor && !sourceMode) return null

  const setLink = () => {
    const url = window.prompt('輸入連結 URL')
    if (!url) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 px-3 py-2"
      style={{ borderBottom: '1px solid #2A2A2E' }}
    >
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1">H1</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">H2</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">H3</ToolbarButton>
      <div className="w-px h-4 bg-[#2A2A2E] mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="粗體"><strong>B</strong></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="斜體"><em>I</em></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="程式碼">{`</>`}</ToolbarButton>
      <div className="w-px h-4 bg-[#2A2A2E] mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="無序清單">≡</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="有序清單">1.</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="引用">❝</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="程式碼區塊">{ '{ }' }</ToolbarButton>
      <div className="w-px h-4 bg-[#2A2A2E] mx-1" />
      <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="連結">🔗</ToolbarButton>
      <ToolbarButton onClick={onImageUpload} active={false} title="插入圖片">🖼</ToolbarButton>
      <div className="w-px h-4 bg-[#2A2A2E] mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} active={false} title="復原">↩</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} active={false} title="重做">↪</ToolbarButton>
      <div className="w-px h-4 bg-[#2A2A2E] mx-1" />
      <ToolbarButton onClick={onToggleSource} active={sourceMode} title="原始碼">{'</>'}</ToolbarButton>
    </div>
  )
}

export default function AdminArticleFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    article_category_id: '',
    is_published: true,
    sort_order: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [sourceMode, setSourceMode] = useState(false)
  const [sourceHtml, setSourceHtml] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[320px] px-5 py-4 text-sm leading-relaxed',
      },
    },
  })

  useEffect(() => {
    api.get('/article-categories').then((res) => setCategories(res.data))

    if (isEdit) {
      api.get('/admin/articles').then((res) => {
        const article = res.data.data.find((a) => a.id === parseInt(id, 10))
        if (!article) return
        setForm({
          title: article.title,
          excerpt: article.excerpt || '',
          article_category_id: article.article_category_id ? String(article.article_category_id) : '',
          is_published: article.is_published,
          sort_order: article.sort_order ?? 0,
        })
        editor?.commands.setContent(article.content || '')
      })
    }
  }, [id, isEdit, editor])

  const handleImageUpload = useCallback(() => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert('請先設定 Cloudinary 環境變數（VITE_CLOUDINARY_CLOUD_NAME、VITE_CLOUDINARY_UPLOAD_PRESET）')
      return
    }
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      setImageUploading(true)
      try {
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: data,
        })
        const json = await res.json()
        editor?.chain().focus().setImage({ src: json.secure_url }).run()
      } catch {
        alert('圖片上傳失敗，請確認 Cloudinary 設定')
      } finally {
        setImageUploading(false)
      }
    }
    input.click()
  }, [editor])

  const toggleSourceMode = () => {
    if (!sourceMode) {
      // 切換到原始碼模式：把編輯器內容放到 textarea
      setSourceHtml(editor?.getHTML() || '')
    } else {
      // 切換回編輯器：把 textarea 內容同步回編輯器
      editor?.commands.setContent(sourceHtml)
    }
    setSourceMode((prev) => !prev)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        content: sourceMode ? sourceHtml : (editor?.getHTML() || ''),
        article_category_id: form.article_category_id || null,
      }
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

          <section className={panelClass}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70] mb-3">文章內容</p>
            {imageUploading && (
              <div className="text-xs text-[#FF5C00] mb-2">圖片上傳中...</div>
            )}
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: '1px solid #2A2A2E', background: '#1A1A1D' }}
            >
              <EditorToolbar
                editor={editor}
                onImageUpload={handleImageUpload}
                sourceMode={sourceMode}
                onToggleSource={toggleSourceMode}
              />
              {sourceMode ? (
                <textarea
                  value={sourceHtml}
                  onChange={(e) => setSourceHtml(e.target.value)}
                  className="w-full outline-none text-xs font-mono px-5 py-4 resize-y"
                  style={{ background: '#1A1A1D', color: '#C0C0C5', minHeight: '320px' }}
                  spellCheck={false}
                />
              ) : (
                <EditorContent
                  editor={editor}
                  className="text-white text-sm"
                />
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 self-start xl:sticky xl:top-6">
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
