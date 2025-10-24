'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TemplateWrapper } from '@/components/templates/TemplateWrapper'
import { generatePDF } from '@/lib/menu-builder/pdfGenerator'

interface Menu {
  _id: string
  title: string
  template: 'sushi' | 'fancy'
  pageCount: number
  doubleSided: boolean
  paperSize: 'letter' | 'a4' | 'legal'
  sections: Array<{
    _id: string
    title: string
    description?: string
    order: number
    isVisible: boolean
    dishes: Array<{
      _id: string
      name: string
      description?: string
      price: number
      category: string
      spiceLevel?: number
      dietary?: string[]
      isAvailable: boolean
      isFeatured: boolean
      image?: any
    }>
  }>
  isPublished: boolean
}

interface Restaurant {
  _id: string
  name: string
  logo?: any
  description?: string
  address?: string
  phone?: string
  website?: string
}

export default function ViewMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const [menu, setMenu] = useState<Menu | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMenu = async () => {
      const resolvedParams = await params
      
      // Mock data for demo - in a real app, you'd fetch from Sanity
      const mockRestaurant: Restaurant = {
        _id: 'restaurant-1',
        name: 'Sample Restaurant',
        logo: { _type: 'image', asset: { _ref: 'image-logo' } },
        description: 'A wonderful dining experience',
        address: '123 Main St, City, State',
        phone: '(555) 123-4567',
        website: 'https://example.com'
      }

      const mockMenu: Menu = {
        _id: resolvedParams.id,
        title: 'Sample Menu',
        template: 'sushi',
        pageCount: 1,
        doubleSided: false,
        paperSize: 'letter',
        sections: [
          {
            _id: 'section-1',
            title: 'Appetizers',
            description: 'Start your meal with these delicious appetizers',
            order: 0,
            isVisible: true,
            dishes: [
              {
                _id: 'dish-1',
                name: 'Edamame',
                description: 'Steamed soybeans with sea salt',
                price: 6.99,
                category: 'appetizer',
                spiceLevel: 1,
                dietary: ['vegetarian'],
                isAvailable: true,
                isFeatured: false,
                image: { _type: 'image', asset: { _ref: 'image-edamame' } }
              },
              {
                _id: 'dish-2',
                name: 'Gyoza',
                description: 'Pan-fried pork dumplings',
                price: 8.99,
                category: 'appetizer',
                spiceLevel: 2,
                dietary: [],
                isAvailable: true,
                isFeatured: true,
                image: { _type: 'image', asset: { _ref: 'image-gyoza' } }
              }
            ]
          },
          {
            _id: 'section-2',
            title: 'Nigiri',
            description: 'Fresh fish over seasoned rice',
            order: 1,
            isVisible: true,
            dishes: [
              {
                _id: 'dish-3',
                name: 'Salmon Nigiri',
                description: 'Fresh Atlantic salmon',
                price: 4.99,
                category: 'nigiri',
                spiceLevel: 1,
                dietary: ['raw'],
                isAvailable: true,
                isFeatured: false,
                image: { _type: 'image', asset: { _ref: 'image-salmon' } }
              },
              {
                _id: 'dish-4',
                name: 'Tuna Nigiri',
                description: 'Premium bluefin tuna',
                price: 5.99,
                category: 'nigiri',
                spiceLevel: 1,
                dietary: ['raw'],
                isAvailable: true,
                isFeatured: true,
                image: { _type: 'image', asset: { _ref: 'image-tuna' } }
              }
            ]
          }
        ],
        isPublished: false
      }

      // Simulate loading
      setTimeout(() => {
        setMenu(mockMenu)
        setRestaurant(mockRestaurant)
        setIsLoading(false)
      }, 500)
    }

    loadMenu()
  }, [params])

  const handlePrint = () => {
    window.print()
  }

  const handleExportPdf = async () => {
    if (!menu) return
    const element = document.getElementById('menu-preview-container')
    if (!element) return
    
    await generatePDF(element, {
      paperSize: menu.paperSize,
      doubleSided: menu.doubleSided,
      quality: 1,
      filename: menu.title
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
        <p className="text-red-800">{error}</p>
        <Link 
          href="/menus" 
          className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Back to Menus
        </Link>
      </div>
    )
  }

  if (!menu || !restaurant) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-yellow-900 mb-2">Menu Not Found</h2>
        <p className="text-yellow-800">The requested menu could not be found.</p>
        <Link 
          href="/menus" 
          className="mt-4 inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Back to Menus
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{menu.title}</h1>
          <p className="text-gray-600">Template: {menu.template} • Pages: {menu.pageCount} • Size: {menu.paperSize}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/menus/${menu._id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Menu
          </Link>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Print Menu
          </button>
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Menu Preview */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Menu Preview</h2>
          <p className="text-sm text-gray-600">This is how your menu will look when printed</p>
        </div>
        <div className="p-6">
          <div id="menu-preview-container" className="relative w-full overflow-auto bg-gray-100 p-4">
            <div className="transform scale-[0.8] origin-top mx-auto shadow-xl border border-gray-300">
              <TemplateWrapper 
                template={menu.template}
                restaurant={restaurant}
                sections={menu.sections}
                pageCount={menu.pageCount}
                doubleSided={menu.doubleSided}
                paperSize={menu.paperSize}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Menu Information</h3>
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-gray-900">Title</dt>
              <dd className="text-gray-600">{menu.title}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Template</dt>
              <dd className="text-gray-600 capitalize">{menu.template}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Page Count</dt>
              <dd className="text-gray-600">{menu.pageCount}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Double Sided</dt>
              <dd className="text-gray-600">{menu.doubleSided ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Paper Size</dt>
              <dd className="text-gray-600 capitalize">{menu.paperSize}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Status</dt>
              <dd className="text-gray-600">{menu.isPublished ? 'Published' : 'Draft'}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sections & Dishes</h3>
          <div className="space-y-4">
            {menu.sections.map((section) => (
              <div key={section._id} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{section.title}</h4>
                {section.description && (
                  <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                )}
                <div className="space-y-1">
                  {section.dishes.map((dish) => (
                    <div key={dish._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{dish.name}</span>
                      <span className="font-medium text-gray-900">${dish.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">{section.dishes.length} dishes</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
