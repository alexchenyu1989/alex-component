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

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">文章</h1>
          <p className="text-sm text-[#6B6B70] mt-1">教學資源與技術分享</p>
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

        {/* Articles List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: '#141417' }} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-[#6B6B70] text-sm">目前尚無文章</div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="block rounded-xl p-5 transition-colors"
                style={{ background: '#141417', border: '1px solid #1F1F23' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3A3A3E')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1F1F23')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {article.category && (
                      <span
                        className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mb-2"
                        style={{ background: '#FF5C0015', color: '#FF5C00' }}
                      >
                        {article.category.name}
                      </span>
                    )}
                    <h2 className="text-base font-semibold text-white leading-snug">{article.title}</h2>
                    {article.excerpt && (
                      <p className="text-sm text-[#6B6B70] mt-1.5 line-clamp-2">{article.excerpt}</p>
                    )}
                  </div>
                  <span className="text-xs text-[#6B6B70] shrink-0 mt-1">
                    {new Date(article.created_at).toLocaleDateString('zh-TW')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
