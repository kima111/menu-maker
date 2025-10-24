'use client'

import { useState } from 'react'
import { useMenuBuilder } from '@/context/MenuBuilderContext'

interface DishCardProps {
  dish: any
  sectionId: string
  onUpdate: (dishId: string, updates: any) => void
  onDelete: (dishId: string) => void
}

export function DishCard({ dish, sectionId, onUpdate, onDelete }: DishCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: dish.name,
    description: dish.description || '',
    price: dish.price,
    category: dish.category,
    spiceLevel: dish.spiceLevel || 1,
    dietary: dish.dietary || [],
    isAvailable: dish.isAvailable,
    isFeatured: dish.isFeatured
  })

  const handleSave = () => {
    onUpdate(dish._id, formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: dish.name,
      description: dish.description || '',
      price: dish.price,
      category: dish.category,
      spiceLevel: dish.spiceLevel || 1,
      dietary: dish.dietary || [],
      isAvailable: dish.isAvailable,
      isFeatured: dish.isFeatured
    })
    setIsEditing(false)
  }

  const getSpiceColor = (level: number) => {
    const colors = ['#90EE90', '#FFD700', '#FFA500', '#FF6347', '#DC143C']
    return colors[level - 1] || '#90EE90'
  }

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dish Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="appetizer">Appetizer</option>
                <option value="soup">Soup</option>
                <option value="salad">Salad</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
                <option value="nigiri">Nigiri</option>
                <option value="sashimi">Sashimi</option>
                <option value="roll">Roll</option>
                <option value="specialty">Specialty</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spice Level
            </label>
            <select
              value={formData.spiceLevel}
              onChange={(e) => setFormData({ ...formData, spiceLevel: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Mild</option>
              <option value={2}>Medium</option>
              <option value={3}>Hot</option>
              <option value={4}>Very Hot</option>
              <option value={5}>Extreme</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <div className="w-full h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 text-sm">
              Image Upload (Demo)
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="mr-2"
              />
              Available
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="mr-2"
              />
              Featured
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{dish.name}</h3>
          {dish.description && (
            <p className="text-gray-600 text-sm mt-1">{dish.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {dish.spiceLevel && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getSpiceColor(dish.spiceLevel) }}
            />
          )}
          <span className="font-bold text-lg">${dish.price}</span>
        </div>
      </div>

      {dish.image && (
        <div className="mb-2">
          <img
            src={getImageUrl(dish.image, 200, 150) || ''}
            alt={dish.name}
            className="w-full h-24 object-cover rounded"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{dish.category}</span>
          {dish.dietary && dish.dietary.map((tag: string) => (
            <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(dish._id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to get image URL
function getImageUrl(image: any, width?: number, height?: number) {
  if (!image) return null
  
  // Return a placeholder image URL for demo
  return `https://via.placeholder.com/${width || 200}x${height || 150}/cccccc/666666?text=Image`
}
