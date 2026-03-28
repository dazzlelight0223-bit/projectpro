import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AddProjectModal from '../components/AddProjectModal'
import SuccessModal from '../components/SuccessModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { Search, Edit2, Trash2, Plus } from 'lucide-react'

interface Project {
  id: string | number
  name: string
  fullName?: string
  fullname?: string
  shortName?: string
  shortname?: string
  createdAt?: string
  createdat?: string
}

// Helper function to normalize field names
function normalizeProject(project: any): Project {
  return {
    id: project.id,
    name: project.name,
    fullName: project.fullName || project.fullname || '',
    shortName: project.shortName || project.shortname || '',
    createdAt: project.createdAt || project.createdat || new Date().toISOString(),
  }
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setProjects((data || []).map(normalizeProject))
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      alert('無法加載項目，請檢查 Supabase 連接')
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProject = async (projectData: { name: string; fullName: string; shortName: string; description?: string }) => {
    try {
      setIsSaving(true)
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: projectData.name,
          fullName: projectData.fullName,
          shortName: projectData.shortName,
          description: projectData.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active'
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setProjects([...projects, normalizeProject(data)])
      setIsModalOpen(false)
      setSuccessMessage('項目已成功添加')
      setShowSuccess(true)
    } catch (error) {
      console.error('Failed to add project:', error)
      alert('添加項目失敗：' + (error as any).message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = (id: string | number) => {
    setDeleteTargetId(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return
    
    try {
      setIsDeleting(true)
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteTargetId)

      if (error) throw error

      setProjects(projects.filter((p) => p.id !== deleteTargetId))
      setDeleteConfirmOpen(false)
      setDeleteTargetId(null)
      setSuccessMessage('項目已成功刪除')
      setShowSuccess(true)
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('刪除項目失敗：' + (error as any).message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setDeleteTargetId(null)
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
                        onClick={() => handleDeleteClick(project.id)}
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

      <SuccessModal
        isOpen={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        title="確認刪除項目"
        message="確定要刪除此項目嗎？此操作無法撤銷。"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </div>
  )
}
