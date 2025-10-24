'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewMenuPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    template: 'sushi',
    pageCount: 1,
    doubleSided: false,
    paperSize: 'letter'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // TODO: Implement menu creation
    console.log('Creating menu:', formData)
    router.push('/menus')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Menu</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Menu Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="template" className="block text-sm font-medium text-gray-700">
            Template
          </label>
          <select
            id="template"
            value={formData.template}
            onChange={(e) => setFormData({ ...formData, template: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sushi">Sushi Restaurant</option>
            <option value="fancy">Fancy Restaurant</option>
          </select>
        </div>

        <div>
          <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700">
            Page Count
          </label>
          <input
            id="pageCount"
            type="number"
            min="1"
            max="10"
            value={formData.pageCount}
            onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value) })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="paperSize" className="block text-sm font-medium text-gray-700">
            Paper Size
          </label>
          <select
            id="paperSize"
            value={formData.paperSize}
            onChange={(e) => setFormData({ ...formData, paperSize: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="letter">Letter (8.5" × 11")</option>
            <option value="a4">A4 (210mm × 297mm)</option>
            <option value="legal">Legal (8.5" × 14")</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="doubleSided"
            type="checkbox"
            checked={formData.doubleSided}
            onChange={(e) => setFormData({ ...formData, doubleSided: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="doubleSided" className="ml-2 block text-sm text-gray-900">
            Double-sided printing
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Menu
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
