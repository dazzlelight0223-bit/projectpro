import React, { useState, useEffect } from 'react'
import apiClient from '../api/client'
import { Folder, Users, Building2, Bell } from 'lucide-react'

interface Stats {
  projects: number
  users: number
  clients: number
  notifications: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    users: 0,
    clients: 0,
    notifications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: '項目', value: stats.projects, icon: Folder, color: 'blue' },
    { label: '用戶', value: stats.users, icon: Users, color: 'green' },
    { label: '客戶端', value: stats.clients, icon: Building2, color: 'purple' },
    { label: '通知', value: stats.notifications, icon: Bell, color: 'orange' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">儀表板</h1>

      {loading ? (
        <div className="text-center py-12">加載中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-green-50 text-green-600',
              purple: 'bg-purple-50 text-purple-600',
              orange: 'bg-orange-50 text-orange-600',
            }

            return (
              <div
                key={card.label}
                className="bg-white rounded-lg shadow p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      colorClasses[card.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
