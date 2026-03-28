import React, { useState } from 'react'
import { X } from 'lucide-react'

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (project: { name: string; fullName: string; shortName: string; description?: string }) => void
  isLoading?: boolean
}

export default function AddProjectModal({ isOpen, onClose, onSave, isLoading = false }: AddProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    shortName: '',
    description: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.fullName && formData.shortName) {
      onSave(formData)
      setFormData({ name: '', fullName: '', shortName: '', description: '' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-3xl font-bold text-gray-900">編輯項目</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <X size={28} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            {/* Name Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                項目名稱
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Project Alpha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                required
              />
            </div>

            {/* Full Name Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                全名
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Project Alpha Full"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                required
              />
            </div>

            {/* Short Name Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                簡稱
              </label>
              <input
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="PA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                描述
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description for Project Alpha"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-lg"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
