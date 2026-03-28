import React, { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
  duration?: number
}

export default function SuccessModal({ 
  isOpen, 
  message, 
  onClose, 
  duration = 2000 
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">成功！</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
