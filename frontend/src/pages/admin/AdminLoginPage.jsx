import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/axios'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/admin/login', form)
      localStorage.setItem('admin_token', res.data.token)
      navigate('/admin/components')
    } catch {
      setError('帳號或密碼錯誤')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center" style={{ colorScheme: 'dark' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}>
            <span className="text-white font-bold text-xl">i</span>
          </div>
          <h1 className="font-mono font-semibold text-2xl tracking-[4px] text-white">ADMIN</h1>
          <p className="text-sm text-[#6B6B70] mt-1">Alex Component Library 管理後台</p>
        </div>

        {/* Card */}
        <div className="bg-[#141417] border border-[#2A2A2E] rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6B6B70] uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@ibest.dev"
                className="w-full px-4 py-2.5 text-sm bg-[#1A1A1D] border border-[#2A2A2E] rounded-lg text-white placeholder:text-[#6B6B70] focus:outline-none focus:border-[#FF5C00]/50 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6B6B70] uppercase tracking-wider">密碼</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-sm bg-[#1A1A1D] border border-[#2A2A2E] rounded-lg text-white placeholder:text-[#6B6B70] focus:outline-none focus:border-[#FF5C00]/50 transition-colors"
                required
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-lg disabled:opacity-50 transition-opacity mt-2"
              style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
