'use client'

import { useState } from 'react'
import { useMenuBuilder } from '@/context/MenuBuilderContext'
import { DishCard } from './DishCard'
import { MenuPreview } from './MenuPreview'

interface MenuEditorProps {
  restaurant: any
  initialMenu?: any
}

export function MenuEditor({ restaurant, initialMenu }: MenuEditorProps) {
  const { state, updateMenu, addSection, updateSection, deleteSection, addDish, updateDish, deleteDish } = useMenuBuilder()
  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder')
  const [newSectionTitle, setNewSectionTitle] = useState('')

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return

    const newSection = {
      _id: `temp-${Date.now()}`,
      title: newSectionTitle,
      description: '',
      order: state.currentMenu?.sections.length || 0,
      isVisible: true,
      dishes: []
    }

    addSection(newSection)
    setNewSectionTitle('')
  }

  const handleAddDish = (sectionId: string) => {
    const newDish = {
      _id: `temp-dish-${Date.now()}`,
      name: 'New Dish',
      description: '',
      price: 0,
      category: 'main',
      spiceLevel: 1,
      dietary: [],
      isAvailable: true,
      isFeatured: false
    }

    addDish(sectionId, newDish)
  }

  const handleUpdateDish = (sectionId: string, dishId: string, updates: any) => {
    updateDish(sectionId, dishId, updates)
  }

  const handleDeleteDish = (sectionId: string, dishId: string) => {
    deleteDish(sectionId, dishId)
  }

  const handleUpdateSection = (sectionId: string, updates: any) => {
    updateSection(sectionId, updates)
  }

  const handleDeleteSection = (sectionId: string) => {
    deleteSection(sectionId)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Menu Editor</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'builder' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Builder
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'preview' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'builder' ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Menu Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Menu Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Menu Title
                    </label>
                    <input
                      type="text"
                      value={state.currentMenu?.title || ''}
                      onChange={(e) => updateMenu({ title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template
                    </label>
                    <select
                      value={state.currentMenu?.template || 'sushi'}
                      onChange={(e) => updateMenu({ template: e.target.value as 'sushi' | 'fancy' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="sushi">Sushi Restaurant</option>
                      <option value="fancy">Fancy Restaurant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={state.currentMenu?.pageCount || 1}
                      onChange={(e) => updateMenu({ pageCount: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paper Size
                    </label>
                    <select
                      value={state.currentMenu?.paperSize || 'letter'}
                      onChange={(e) => updateMenu({ paperSize: e.target.value as 'letter' | 'a4' | 'legal' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="letter">Letter (8.5" × 11")</option>
                      <option value="a4">A4 (210mm × 297mm)</option>
                      <option value="legal">Legal (8.5" × 14")</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={state.currentMenu?.doubleSided || false}
                      onChange={(e) => updateMenu({ doubleSided: e.target.checked })}
                      className="mr-2"
                    />
                    Double-sided printing
                  </label>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Menu Sections</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Section title"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddSection}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Section
                    </button>
                  </div>
                </div>

                {state.currentMenu?.sections.map((section) => (
                  <div key={section._id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">{section.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddDish(section._id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Add Dish
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section._id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete Section
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.dishes.map((dish) => (
                        <DishCard
                          key={dish._id}
                          dish={dish}
                          sectionId={section._id}
                          onUpdate={(dishId, updates) => handleUpdateDish(section._id, dishId, updates)}
                          onDelete={(dishId) => handleDeleteDish(section._id, dishId)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto">
            <MenuPreview restaurant={restaurant} />
          </div>
        )}
      </div>
    </div>
  )
}
