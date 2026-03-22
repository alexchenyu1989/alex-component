import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import api from '@/lib/axios'

export default function HomePage() {
  const [components, setComponents] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const category = searchParams.get('category') || ''
  const tag = searchParams.get('tag') || ''
  const search = searchParams.get('search') || ''

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data))
    api.get('/tags').then((res) => setTags(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    api.get('/components', { params: { category, tag, search } })
      .then((res) => setComponents(res.data.data))
      .finally(() => setLoading(false))
  }, [category, tag, search])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ category, tag, search: searchInput })
  }

  const setCategory = (val) => {
    setSearchParams({ category: val, tag, search })
    setSidebarOpen(false)
  }
  const setTag = (val) => setSearchParams({ category, tag: val, search })

  const activeFilterCount = (category ? 1 : 0) + (tag ? 1 : 0)

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Topbar */}
      <header
        className="shrink-0 sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-10 h-16"
        style={{ background: '#141417', borderBottom: '1px solid #2A2A2E' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}
          >
            i
          </span>
          <span
            className="hidden sm:block text-white font-semibold tracking-normal"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px' }}
          >
            Alex Component Library
          </span>
        </Link>

        {/* Search - 暫時隱藏 */}
        {/* <form onSubmit={handleSearch} className="relative flex-1 max-w-[280px] sm:mx-auto">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#6B6B70' }} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="搜尋元件..."
            className="h-9 w-full rounded-lg pl-9 pr-4 text-sm text-white outline-none"
            style={{
              background: '#1A1A1D',
              border: '1px solid #2A2A2E',
              color: '#FFFFFF',
              caretColor: '#FF5C00',
            }}
          />
        </form> */}

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* Filter button - mobile only */}
          <button
            className="lg:hidden relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ border: '1px solid #2A2A2E', background: sidebarOpen ? '#FF5C0018' : '#1A1A1D', color: sidebarOpen ? '#FF5C00' : '#8B8B90' }}
            onClick={() => setSidebarOpen(true)}
          >
            <SlidersHorizontal size={16} />
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-semibold text-white"
                style={{ background: '#FF5C00' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
          <Link
            to="/admin/login"
            className="hidden sm:block text-sm font-medium transition-colors"
            style={{ color: '#8B8B90' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8B8B90')}
          >
            後台管理
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-[260px] shrink-0 flex flex-col overflow-y-auto
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:sticky lg:top-16 lg:self-start lg:min-h-[calc(100vh-4rem)] lg:translate-x-0 lg:static
          `}
          style={{ background: '#141417', borderRight: '1px solid #2A2A2E' }}
        >
          {/* Mobile sidebar header */}
          <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-[#1F1F23]">
            <span className="text-sm font-semibold text-white">篩選</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-[#6B6B70] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 分類 */}
          <div className="px-3 pt-4 pb-1">
            <p className="text-[11px] font-semibold px-3 mb-2 tracking-[0.5px]" style={{ color: '#6B6B70' }}>
              分類
            </p>
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setCategory('')}
                className="w-full text-left text-sm px-3 h-9 rounded-lg flex items-center transition-colors"
                style={!category ? { background: '#FF5C0018', color: '#FF5C00', fontWeight: '500' } : { color: '#8B8B90' }}
                onMouseEnter={(e) => { if (category) e.currentTarget.style.color = '#FFFFFF' }}
                onMouseLeave={(e) => { if (category) e.currentTarget.style.color = '#8B8B90' }}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.slug)}
                  className="w-full text-left text-sm px-3 h-9 rounded-lg flex items-center transition-colors"
                  style={
                    category === cat.slug
                      ? { background: '#FF5C0018', color: '#FF5C00', fontWeight: '500' }
                      : { color: '#8B8B90' }
                  }
                  onMouseEnter={(e) => { if (category !== cat.slug) e.currentTarget.style.color = '#FFFFFF' }}
                  onMouseLeave={(e) => { if (category !== cat.slug) e.currentTarget.style.color = '#8B8B90' }}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>

          {/* 標籤 */}
          {tags.length > 0 && (
            <div className="px-3 pt-5 pb-4" style={{ borderTop: '1px solid #1F1F23', marginTop: '12px' }}>
              <p className="text-[11px] font-semibold px-3 mb-2 tracking-[0.5px]" style={{ color: '#6B6B70' }}>
                標籤
              </p>
              <div className="flex flex-wrap gap-1.5 px-3 pt-1">
                {tags.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTag(tag === t.slug ? '' : t.slug)}
                    className="text-[11px] px-2.5 py-1 rounded-full transition-colors"
                    style={
                      tag === t.slug
                        ? { background: '#FF5C0018', color: '#FF5C00', border: '1px solid #FF5C0040' }
                        : { border: '1px solid #2A2A2E', color: '#6B6B70' }
                    }
                    onMouseEnter={(e) => { if (tag !== t.slug) e.currentTarget.style.color = '#FFFFFF' }}
                    onMouseLeave={(e) => { if (tag !== t.slug) e.currentTarget.style.color = '#6B6B70' }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-8 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl h-64 animate-pulse"
                  style={{ background: '#141417', border: '1px solid #1F1F23' }}
                />
              ))}
            </div>
          ) : components.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="text-sm" style={{ color: '#6B6B70' }}>找不到元件</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {components.map((comp) => (
                <Link
                  key={comp.id}
                  to={`/components/${comp.slug}`}
                  className="group rounded-xl overflow-hidden transition-all"
                  style={{ background: '#141417', border: '1px solid #1F1F23' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3A3A3E')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1F1F23')}
                >
                  {/* Preview */}
                  <div
                    className="overflow-hidden relative"
                    style={{ height: '320px', background: '#111113' }}
                  >
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
                  </div>

                  {/* Info */}
                  <div className="px-5 py-4" style={{ borderTop: '1px solid #1F1F23' }}>
                    <h3
                      className="text-sm font-medium transition-colors"
                      style={{ color: '#FFFFFF' }}
                    >
                      {comp.title}
                    </h3>
                    {comp.description && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#6B6B70' }}>
                        {comp.description}
                      </p>
                    )}
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {comp.category && (
                        <span
                          className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                          style={{ background: '#FF5C0015', color: '#FF5C00' }}
                        >
                          {comp.category.name}
                        </span>
                      )}
                      {comp.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="text-[11px] px-2.5 py-0.5 rounded-full"
                          style={{ border: '1px solid #2A2A2E', color: '#6B6B70' }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
