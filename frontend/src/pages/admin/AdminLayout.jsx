import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { LayoutGrid, Tag, FolderOpen, LogOut, ExternalLink, Settings } from 'lucide-react'
import api from '@/lib/axios'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    api.get('/admin/me').then((res) => setAdmin(res.data)).catch(() => navigate('/admin/login'))
  }, [])

  const handleLogout = async () => {
    await api.post('/admin/logout')
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 h-11 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-[#FF5C0018] text-[#FF5C00] font-medium'
        : 'text-[#8B8B90] hover:text-white hover:bg-white/5'
    }`

  const navIconClass = (isActive) =>
    isActive ? 'text-[#FF5C00]' : 'text-[#6B6B70]'

  return (
    <div className="min-h-screen flex bg-[#0A0A0B] text-white" style={{ colorScheme: 'dark' }}>

      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 flex flex-col bg-[#141417] border-r border-[#2A2A2E]">

        {/* Logo */}
        <div className="px-6 py-7 flex items-center gap-2.5 border-b border-[#1F1F23]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}>
            <span className="text-white font-bold text-sm">i</span>
          </div>
          <span className="font-mono font-semibold text-xl tracking-[4px] text-white">ADMIN</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <p className="text-[11px] font-semibold text-[#6B6B70] tracking-widest uppercase px-3 mb-1">主選單</p>
          <NavLink to="/admin/components" className={navClass}>
            {({ isActive }) => (<><LayoutGrid size={18} className={navIconClass(isActive)} /> 元件管理</>)}
          </NavLink>
          <NavLink to="/admin/categories" className={navClass}>
            {({ isActive }) => (<><FolderOpen size={18} className={navIconClass(isActive)} /> 分類管理</>)}
          </NavLink>
          <NavLink to="/admin/tags" className={navClass}>
            {({ isActive }) => (<><Tag size={18} className={navIconClass(isActive)} /> 標籤管理</>)}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#1F1F23] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}>
            <span className="text-white font-semibold text-sm">
              {admin?.name?.[0] || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-[#6B6B70] truncate">{admin?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-[#6B6B70] hover:text-[#FF5C00] transition-colors p-1">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-10 bg-[#141417] border-b border-[#2A2A2E] shrink-0">
          <div />
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="flex items-center gap-1.5 px-3.5 h-9 rounded-lg text-sm font-medium text-[#8B8B90] hover:text-white border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-white/5 transition-all">
              <ExternalLink size={15} />
              前台預覽
            </Link>
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A4C 100%)' }}>
              <span className="text-white font-semibold text-sm">{admin?.name?.[0] || 'A'}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
