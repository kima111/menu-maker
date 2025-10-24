'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRestaurant } from '@/context/RestaurantContext'

export default function DashboardPage() {
  const { currentRestaurant, restaurants, isLoading: restaurantLoading } = useRestaurant()
  const [dbConnected, setDbConnected] = useState(false)

  useEffect(() => {
    // Test database connection
    fetch('/api/test-db-connection')
      .then(response => response.json())
      .then(data => setDbConnected(data.success))
      .catch(() => setDbConnected(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Demo User</p>
      </div>

      {/* Database Connection Status */}
      <div className={`p-4 rounded-lg ${dbConnected ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`text-2xl mr-3 ${dbConnected ? 'text-green-600' : 'text-yellow-600'}`}>
              {dbConnected ? '✅' : '⚠️'}
            </span>
            <div>
              <h3 className={`font-semibold ${dbConnected ? 'text-green-900' : 'text-yellow-900'}`}>
                {dbConnected ? 'Database Connected' : 'Database Not Configured'}
              </h3>
              <p className={`text-sm ${dbConnected ? 'text-green-700' : 'text-yellow-700'}`}>
                {dbConnected 
                  ? 'Your Neon database is connected and ready to use' 
                  : 'Configure your database connection to start creating menus'
                }
              </p>
            </div>
          </div>
          <Link 
            href="/settings"
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              dbConnected 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {dbConnected ? 'Settings' : 'Setup Database'}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Restaurants</h3>
          <p className="text-3xl font-bold text-blue-600">{restaurants.length}</p>
          <Link 
            href="/restaurants" 
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Manage restaurants →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Menus</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
          <Link 
            href="/menus" 
            className="text-sm text-green-600 hover:text-green-500"
          >
            View all menus →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Dishes</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <Link 
            href="/dishes" 
            className="text-sm text-purple-600 hover:text-purple-500"
          >
            Manage dishes →
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/restaurants"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Restaurant
          </Link>
          <Link 
            href="/dishes"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add New Dish
          </Link>
          <Link 
            href="/menus/new"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Create New Menu
          </Link>
          {!dbConnected && (
            <Link 
              href="/settings"
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Setup Database
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
