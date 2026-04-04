'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Guide des Tailles</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Size Guide Image */}
          <div className="flex justify-center">
            <img 
              src="/jerseys/guide-des-tailles.jpeg" 
              alt="Guide des tailles"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
