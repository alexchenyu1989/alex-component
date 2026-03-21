import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Copy, Check } from 'lucide-react'
import api from '@/lib/axios'

export default function ComponentPage() {
  const { slug } = useParams()
  const [component, setComponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    api.get(`/components/${slug}`)
      .then((res) => setComponent(res.data))
      .finally(() => setLoading(false))
  }, [slug])

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(component.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([component.markdown_content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${component.slug}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0B' }}>
      <p className="text-sm" style={{ color: '#6B6B70' }}>載入中...</p>
    </div>
  )

  if (!component) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0B' }}>
      <p className="text-sm" style={{ color: '#6B6B70' }}>找不到元件</p>
    </div>
  )

  return (
    <div className="min-h-screen text-white" style={{ background: '#0A0A0B', fontFamily: 'Inter, sans-serif' }}>

      {/* Topbar */}
      <header
        className="sticky top-0 z-20 flex items-center gap-2 sm:gap-4 px-4 sm:px-10 h-16"
        style={{ background: '#141417', borderBottom: '1px solid #2A2A2E' }}
      >
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}
          >
            i
          </span>
          <span
            className="hidden sm:block text-white font-semibold text-xl tracking-normal"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Alex Component Library
          </span>
        </Link>

        <span className="hidden sm:block mx-2" style={{ color: '#2A2A2E' }}>|</span>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm transition-colors shrink-0"
          style={{ color: '#6B6B70' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6B6B70')}
        >
          <ArrowLeft size={14} /> 返回
        </Link>

        <span style={{ color: '#2A2A2E' }}>/</span>

        <span className="text-sm truncate min-w-0" style={{ color: '#8B8B90' }}>{component.title}</span>
      </header>

      {/* Content */}
      <div className="px-4 sm:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* Page Title & Meta */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">{component.title}</h1>
          {component.description && (
            <p className="mt-2 text-sm leading-relaxed" style={{ color: '#8B8B90' }}>
              {component.description}
            </p>
          )}
          <div className="flex gap-2 flex-wrap mt-3">
            {component.category && (
              <span
                className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                style={{ background: '#FF5C0015', color: '#FF5C00' }}
              >
                {component.category.name}
              </span>
            )}
            {component.tags?.map((tag) => (
              <span
                key={tag.id}
                className="text-[11px] px-2.5 py-1 rounded-full"
                style={{ border: '1px solid #2A2A2E', color: '#6B6B70' }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid #1F1F23' }}
        >
          {/* Card Titlebar */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ background: '#141417', borderBottom: '1px solid #1F1F23' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#1F1F23' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#1F1F23' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#1F1F23' }} />
            </div>
            <span
              className="text-[11px] font-semibold tracking-[1px]"
              style={{ color: '#6B6B70', fontFamily: 'DM Mono, monospace' }}
            >
              PREVIEW
            </span>
            <div className="w-14" />
          </div>
          <div className="h-[400px] sm:h-[680px]" style={{ background: '#111113' }}>
            <iframe
              srcDoc={component.preview_html}
              className="w-full h-full"
              sandbox="allow-scripts"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)', color: '#FFFFFF' }}
          >
            <Download size={14} /> 下載 .md 檔案
          </button>
          {component.prompt && (
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#1A1A1D', border: '1px solid #2A2A2E', color: '#8B8B90' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8B8B90')}
            >
              {copied
                ? <><Check size={14} style={{ color: '#FF5C00' }} /> 已複製</>
                : <><Copy size={14} /> 複製 Prompt</>
              }
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
