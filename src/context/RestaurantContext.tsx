'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getRestaurants } from '@/lib/db/queries'

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

interface RestaurantContextType {
  currentRestaurant: Restaurant | null
  restaurants: Restaurant[]
  setCurrentRestaurant: (restaurant: Restaurant | null) => void
  refreshRestaurants: () => Promise<void>
  isLoading: boolean
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshRestaurants = async () => {
    try {
      setIsLoading(true)
      // For now, we'll use a placeholder owner ID
      // In a real app, this would come from the authenticated user's context
      const ownerId = 'default-owner'
      const result = await getRestaurants(ownerId)
      setRestaurants(result)
      
      // If no current restaurant is set and we have restaurants, set the first one
      if (!currentRestaurant && result.length > 0) {
        setCurrentRestaurant(result[0])
      }
    } catch (error) {
      console.error('Failed to load restaurants:', error)
      // If it's a database configuration error, show empty state
      if (error instanceof Error && error.message.includes('Database not configured')) {
        setRestaurants([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshRestaurants()
  }, [])

  return (
    <RestaurantContext.Provider value={{
      currentRestaurant,
      restaurants,
      setCurrentRestaurant,
      refreshRestaurants,
      isLoading
    }}>
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider')
  }
  return context
}
