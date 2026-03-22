import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/axios'

export default function ArticlePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/articles/${slug}`)
      .then((res) => setArticle(res.data))
      .catch(() => navigate('/articles'))
      .finally(() => setLoading(false))
  }, [slug])

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
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        {loading ? (
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded-lg animate-pulse" style={{ background: '#141417' }} />
            <div className="h-4 w-1/3 rounded animate-pulse" style={{ background: '#141417' }} />
            <div className="h-96 rounded-xl animate-pulse mt-8" style={{ background: '#141417' }} />
          </div>
        ) : article ? (
          <>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#6B6B70] mb-6">
              <Link to="/articles" className="hover:text-white transition-colors">文章</Link>
              <span>/</span>
              {article.category && (
                <>
                  <span>{article.category.name}</span>
                  <span>/</span>
                </>
              )}
              <span className="text-[#8B8B90] truncate">{article.title}</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              {article.category && (
                <span
                  className="inline-block text-xs px-2.5 py-1 rounded-full font-medium mb-3"
                  style={{ background: '#FF5C0015', color: '#FF5C00' }}
                >
                  {article.category.name}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">{article.title}</h1>
              {article.excerpt && (
                <p className="text-[#6B6B70] mt-3 text-base leading-relaxed">{article.excerpt}</p>
              )}
              <p className="text-xs text-[#6B6B70] mt-3">
                {new Date(article.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-[#1F1F23] mb-8" />

            {/* Content */}
            <div
              className="article-content prose-dark"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
