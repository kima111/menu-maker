'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDishes, createDish, updateDish, deleteDish } from '@/lib/db/queries'
import { getImageUrl } from '@/lib/images/imageUtils'
import { uploadImage } from '@/lib/storage/blob'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Dish {
  id: string
  name: string
  description?: string | null
  price: string | null
  category?: string | null
  spiceLevel?: number | null
  dietary?: string[] | null
  isAvailable: boolean | null
  isFeatured: boolean | null
  image?: string | null
  restaurantId: string
  createdAt: Date
  updatedAt: Date
}

interface DishFormData {
  name: string
  description: string
  price: string
  category: string
  spiceLevel: number
  dietary: string[]
  isAvailable: boolean
  isFeatured: boolean
  image?: File
}

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [formData, setFormData] = useState<DishFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    spiceLevel: 1,
    dietary: [],
    isAvailable: true,
    isFeatured: false,
  })

  const categories = [
    'appetizer',
    'main',
    'dessert',
    'beverage',
    'salad',
    'soup',
    'pasta',
    'pizza',
    'seafood',
    'meat',
    'vegetarian',
    'vegan'
  ]

  const dietaryOptions = [
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'nut-free',
    'spicy',
    'halal',
    'kosher'
  ]

  useEffect(() => {
    loadDishes()
  }, [])

  const loadDishes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // For now, we'll use a placeholder restaurant ID
      // In a real app, this would come from the authenticated user's context
      const restaurantId = 'default-restaurant'
      const result = await getDishes(restaurantId)
      setDishes(result)
    } catch (err) {
      console.error('Failed to load dishes:', err)
      setError('Failed to load dishes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      setError(null)

      let imageUrl: string | undefined

      // Upload image if provided
      if (formData.image) {
        const uploadResult = await uploadImage(formData.image, `dish-${Date.now()}-${formData.image.name}`)
        imageUrl = uploadResult.url
      }

      const dishData = {
        name: formData.name,
        description: formData.description || null,
        price: formData.price,
        category: formData.category || null,
        spiceLevel: formData.spiceLevel,
        dietary: formData.dietary,
        isAvailable: formData.isAvailable,
        isFeatured: formData.isFeatured,
        image: imageUrl || null,
        restaurantId: 'default-restaurant', // In a real app, this would come from user context
      }

      if (editingDish) {
        await updateDish(editingDish.id, dishData)
        toast.success('Dish updated successfully!')
      } else {
        await createDish(dishData)
        toast.success('Dish created successfully!')
      }

      setIsDialogOpen(false)
      resetForm()
      loadDishes()
    } catch (err) {
      console.error('Failed to save dish:', err)
      setError('Failed to save dish. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (dishId: string) => {
    try {
      await deleteDish(dishId)
      toast.success('Dish deleted successfully!')
      loadDishes()
    } catch (err) {
      console.error('Failed to delete dish:', err)
      setError('Failed to delete dish. Please try again.')
    }
  }

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish)
    setFormData({
      name: dish.name,
      description: dish.description || '',
      price: dish.price || '',
      category: dish.category || '',
      spiceLevel: dish.spiceLevel || 1,
      dietary: dish.dietary || [],
      isAvailable: dish.isAvailable || true,
      isFeatured: dish.isFeatured || false,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      spiceLevel: 1,
      dietary: [],
      isAvailable: true,
      isFeatured: false,
    })
    setEditingDish(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const toggleDietary = (option: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option]
    }))
  }

  if (isLoading && dishes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dishes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dishes</h1>
          <p className="text-sm text-gray-600 mt-1">
            {dishes.length} dishes in your menu
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Dish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDish ? 'Edit Dish' : 'Add New Dish'}
              </DialogTitle>
              <DialogDescription>
                {editingDish ? 'Update the dish information' : 'Add a new dish to your menu'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="spiceLevel">Spice Level</Label>
                  <Select value={formData.spiceLevel.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, spiceLevel: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Mild (1)</SelectItem>
                      <SelectItem value="2">Medium (2)</SelectItem>
                      <SelectItem value="3">Hot (3)</SelectItem>
                      <SelectItem value="4">Very Hot (4)</SelectItem>
                      <SelectItem value="5">Extreme (5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Dietary Information</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {dietaryOptions.map(option => (
                    <Badge
                      key={option}
                      variant={formData.dietary.includes(option) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleDietary(option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <div className="mt-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  />
                  <span>Available</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  />
                  <span>Featured</span>
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingDish ? 'Update Dish' : 'Create Dish'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {dishes.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dishes yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first dish to the menu.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Dish
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden">
              {dish.image && (
                <div className="aspect-video bg-gray-100">
                  <img
                    src={getImageUrl(dish.image) || ''}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{dish.name}</CardTitle>
                    <CardDescription className="mt-1">
                      ${dish.price}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(dish)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Dish</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{dish.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(dish.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {dish.description && (
                  <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {dish.category && (
                    <Badge variant="secondary">{dish.category}</Badge>
                  )}
                  {dish.dietary?.map((diet) => (
                    <Badge key={diet} variant="outline">{diet}</Badge>
                  ))}
                  {dish.spiceLevel && dish.spiceLevel > 1 && (
                    <Badge variant="outline">🌶️ {dish.spiceLevel}</Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    dish.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dish.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  {dish.isFeatured && (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}