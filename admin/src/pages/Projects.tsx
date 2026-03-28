import React, { useState, useEffect } from 'react'
import apiClient from '../api/client'
import AddProjectModal from '../components/AddProjectModal'
import { Search, Edit2, Trash2, Plus } from 'lucide-react'

interface Project {
  id: string
  name: string
  fullName: string
  shortName: string
  createdAt: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/admin/projects')
      setProjects(response.data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProject = async (projectData: { name: string; fullName: string; shortName: string }) => {
    try {
      setIsSaving(true)
      const response = await apiClient.post('/admin/projects', projectData)
      setProjects([...projects, response.data])
      setIsModalOpen(false)
      alert('項目已成功添加')
    } catch (error) {
      console.error('Failed to add project:', error)
      alert('添加項目失敗，請檢查後端連接')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除此項目嗎?')) {
      try {
        await apiClient.delete(`/admin/projects/${id}`)
        setProjects(projects.filter((p) => p.id !== id))
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">項目</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          新增項目
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="搜索項目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent flex-1 outline-none text-gray-900"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">加載中...</div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  名稱
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  完整名稱
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  簡稱
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  建立時間
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{project.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{project.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {project.fullName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {project.shortName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProject}
        isLoading={isSaving}
      />
    </div>
  )
}
