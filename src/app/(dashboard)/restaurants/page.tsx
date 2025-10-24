'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '@/lib/db/queries'
import { getImageUrl } from '@/lib/images/imageUtils'
import { uploadImage } from '@/lib/storage/blob'
import { useRestaurant } from '@/context/RestaurantContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Building2 } from 'lucide-react'
import { toast } from 'sonner'

interface Restaurant {
  id: string
  name: string
  description?: string | null
  address?: string | null
  phone?: string | null
  website?: string | null
  logo?: string | null
  slug: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

interface RestaurantFormData {
  name: string
  description: string
  address: string
  phone: string
  website: string
  logo?: File
}

export default function RestaurantsPage() {
  const { restaurants, refreshRestaurants, isLoading: restaurantLoading } = useRestaurant()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null)
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    description: '',
    address: '',
    phone: '',
    website: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      setError(null)

      let logoUrl: string | undefined

      // Upload logo if provided
      if (formData.logo) {
        const uploadResult = await uploadImage(formData.logo, `restaurant-logo-${Date.now()}-${formData.logo.name}`)
        logoUrl = uploadResult.url
      }

      const restaurantData = {
        name: formData.name,
        description: formData.description || null,
        address: formData.address || null,
        phone: formData.phone || null,
        website: formData.website || null,
        logo: logoUrl || null,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        ownerId: 'default-owner', // In a real app, this would come from user context
      }

      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant.id, restaurantData)
        toast.success('Restaurant updated successfully!')
      } else {
        await createRestaurant(restaurantData)
        toast.success('Restaurant created successfully!')
      }

      setIsDialogOpen(false)
      resetForm()
      refreshRestaurants() // Refresh the restaurant context
    } catch (err) {
      console.error('Failed to save restaurant:', err)
      setError('Failed to save restaurant. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (restaurantId: string) => {
    try {
      await deleteRestaurant(restaurantId)
      toast.success('Restaurant deleted successfully!')
      refreshRestaurants() // Refresh the restaurant context
    } catch (err) {
      console.error('Failed to delete restaurant:', err)
      setError('Failed to delete restaurant. Please try again.')
    }
  }

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant)
    setFormData({
      name: restaurant.name,
      description: restaurant.description || '',
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      website: restaurant.website || '',
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      website: '',
    })
    setEditingRestaurant(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }))
    }
  }

  if (restaurantLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  if (isLoading && restaurants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-sm text-gray-600 mt-1">
            {restaurants.length} restaurants in your account
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
              </DialogTitle>
              <DialogDescription>
                {editingRestaurant ? 'Update the restaurant information' : 'Add a new restaurant to your account'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
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

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="mt-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingRestaurant ? 'Update Restaurant' : 'Create Restaurant'}
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

      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first restaurant.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Restaurant
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden">
              {restaurant.logo && (
                <div className="aspect-video bg-gray-100">
                  <img
                    src={getImageUrl(restaurant.logo) || ''}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {restaurant.description}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(restaurant)}
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
                          <AlertDialogTitle>Delete Restaurant</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{restaurant.name}"? This action cannot be undone and will also delete all associated menus and dishes.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(restaurant.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {restaurant.address && (
                    <p className="text-gray-600">
                      <strong>Address:</strong> {restaurant.address}
                    </p>
                  )}
                  {restaurant.phone && (
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {restaurant.phone}
                    </p>
                  )}
                  {restaurant.website && (
                    <p className="text-gray-600">
                      <strong>Website:</strong> 
                      <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        {restaurant.website}
                      </a>
                    </p>
                  )}
                </div>
                
                <div className="mt-4">
                  <Link href={`/menus?restaurant=${restaurant.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Menus
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}