'use client'

import { useEffect } from 'react'
import { useMenuBuilder } from '@/context/MenuBuilderContext'
import { MenuEditor } from '@/components/menu-builder/MenuEditor'

interface EditMenuPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditMenuPage({ params }: EditMenuPageProps) {
  const { setMenu } = useMenuBuilder()

  // Mock restaurant data for now
  const restaurant = {
    _id: 'restaurant-1',
    name: 'Sample Restaurant',
    logo: { _type: 'image', asset: { _ref: 'image-logo' } },
    description: 'A wonderful dining experience',
    address: '123 Main St, City, State',
    phone: '(555) 123-4567',
    website: 'https://example.com'
  }

  // Mock menu data for now
  const mockMenu = {
    _id: 'menu-1',
    title: 'Sample Menu',
    template: 'sushi' as const,
    pageCount: 1,
    doubleSided: false,
    paperSize: 'letter' as const,
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

  useEffect(() => {
    const loadMenu = async () => {
      const resolvedParams = await params
      setMenu(mockMenu)
    }
    loadMenu()
  }, [params, setMenu])

  return (
    <MenuEditor restaurant={restaurant} initialMenu={mockMenu} />
  )
}
