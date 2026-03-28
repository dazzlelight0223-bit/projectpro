import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Folder,
  Users,
  Building2,
  Bell,
  UserCheck,
  Settings,
  BookOpen,
  LogOut,
} from 'lucide-react'

interface SidebarProps {
  onLogout: () => void
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: '儀表板', icon: LayoutDashboard },
    { path: '/projects', label: '項目', icon: Folder },
    { path: '/users', label: '用戶', icon: Users },
    { path: '/clients', label: '客戶端', icon: Building2 },
    { path: '/notifications', label: '通知', icon: Bell },
    { path: '/project-members', label: '項目成員', icon: UserCheck },
    { path: '/custom-fields', label: '自定義字段', icon: Settings },
    { path: '/sales-kit', label: '銷售工具包', icon: BookOpen },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    onLogout()
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">ProjectPro</h1>
        <p className="text-sm text-gray-500">管理後台</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">登出</span>
        </button>
      </div>
    </aside>
  )
}
