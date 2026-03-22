import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/lib/axios'

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/article-categories').then((res) => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    api.get('/articles', { params: selectedCategory ? { category: selectedCategory } : {} })
      .then((res) => setArticles(res.data.data))
      .finally(() => setLoading(false))
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Topbar */}
      <header
        className="sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-10 h-16"
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
            className="hidden sm:block text-white font-semibold tracking-normal"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px' }}
          >
            Alex Component Library
          </span>
        </Link>

        <nav className="flex items-center gap-1 ml-4">
          <Link to="/" className="px-3 py-1.5 text-sm text-[#6B6B70] hover:text-white transition-colors rounded-lg">元件</Link>
          <Link to="/articles" className="px-3 py-1.5 text-sm text-white bg-white/8 rounded-lg">文章</Link>
        </nav>

        <div className="ml-auto">
          <Link
            to="/admin"
            className="text-xs text-[#6B6B70] hover:text-white transition-colors"
          >
            後台管理
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-bold text-white" style={{ fontSize: '20px' }}>文章</h1>
          <p className="text-[#6B6B70] mt-1" style={{ fontSize: '15px' }}>教學資源與技術分享</p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            <button
              onClick={() => setSelectedCategory('')}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={!selectedCategory
                ? { background: '#FF5C0020', color: '#FF5C00', border: '1px solid #FF5C0040' }
                : { background: 'transparent', color: '#6B6B70', border: '1px solid #2A2A2E' }
              }
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={selectedCategory === cat.slug
                  ? { background: '#FF5C0020', color: '#FF5C00', border: '1px solid #FF5C0040' }
                  : { background: 'transparent', color: '#6B6B70', border: '1px solid #2A2A2E' }
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#141417' }}>
                <div className="h-44 w-full" style={{ background: '#1F1F23' }} />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-16 rounded-full" style={{ background: '#1F1F23' }} />
                  <div className="h-4 w-4/5 rounded" style={{ background: '#1F1F23' }} />
                  <div className="h-3 w-full rounded" style={{ background: '#1F1F23' }} />
                  <div className="h-3 w-2/3 rounded" style={{ background: '#1F1F23' }} />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-[#6B6B70] text-sm">目前尚無文章</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: '#141417', border: '1px solid #1F1F23' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3A3A3E'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1F1F23'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Cover Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', background: '#1A1A1D' }}>
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1A1A1D 0%, #141417 100%)' }}
          >
            <span className="text-3xl font-bold select-none" style={{ color: '#2A2A2E' }}>
              {article.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Category badge overlay */}
        {article.category && (
          <span
            className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: '#FF5C00', color: '#fff' }}
          >
            {article.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h2 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#FF8A4C] transition-colors">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="text-xs text-[#6B6B70] mt-2 line-clamp-2 leading-relaxed flex-1">
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#4A4A50]" style={{ fontSize: '14px' }}>
            {new Date(article.created_at).toLocaleDateString('zh-TW')}
          </span>
          <span className="text-[#FF5C00] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: '14px' }}>
            閱讀文章 →
          </span>
        </div>
      </div>
    </Link>
  )
}
