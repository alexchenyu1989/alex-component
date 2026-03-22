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

      <div className="w-full">
        {loading ? (
          <div className="px-6 sm:px-12 py-10 space-y-4">
            <div className="h-3 w-48 rounded-full animate-pulse" style={{ background: '#141417' }} />
            <div className="h-8 w-2/3 rounded-lg animate-pulse mt-6" style={{ background: '#141417' }} />
            <div className="h-4 w-1/2 rounded animate-pulse" style={{ background: '#141417' }} />
            <div className="h-96 rounded-xl animate-pulse mt-8" style={{ background: '#141417' }} />
          </div>
        ) : article ? (
          <>
            {/* Article Header */}
            <div className="w-full px-6 sm:px-14 pt-10 pb-0">

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 mb-8" style={{ fontSize: '12px', color: '#4A4A50' }}>
                <Link to="/articles" className="hover:text-[#8B8B90] transition-colors">文章</Link>
                <span style={{ color: '#2A2A2E' }}>›</span>
                {article.category && (
                  <>
                    <span style={{ color: '#6B6B70' }}>{article.category.name}</span>
                    <span style={{ color: '#2A2A2E' }}>›</span>
                  </>
                )}
                <span className="truncate max-w-xs" style={{ color: '#6B6B70' }}>{article.title}</span>
              </div>

              {/* Date + Category row */}
              <div className="flex items-center justify-between gap-4 py-3" style={{ borderTop: '1px solid #1F1F23', borderBottom: '1px solid #1F1F23' }}>
                {/* Date */}
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-semibold tracking-widest uppercase"
                    style={{ fontSize: '10px', color: '#4A4A50', letterSpacing: '0.15em' }}
                  >
                    DATE
                  </span>
                  <span className="font-bold text-white" style={{ fontSize: '28px', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {String(new Date(article.created_at).getDate()).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B6B70' }}>
                    / {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Category */}
                {article.category && (
                  <span
                    className="inline-flex items-center px-4 py-1.5 rounded font-semibold tracking-wide shrink-0"
                    style={{ background: '#FF5C00', color: '#fff', fontSize: '12px', letterSpacing: '0.04em' }}
                  >
                    {article.category.name}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="py-6" style={{ borderBottom: '1px solid #1F1F23' }}>
                <h1
                  className="font-bold text-white leading-tight"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', letterSpacing: '-0.01em' }}
                >
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p
                    className="mt-3 leading-relaxed"
                    style={{ fontSize: '14px', color: '#8B8B90', lineHeight: '1.75' }}
                  >
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 sm:px-12 py-10">
              <div
                className="article-content prose-dark"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
