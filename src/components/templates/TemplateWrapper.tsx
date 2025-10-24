import { SushiTemplate } from './SushiTemplate'
import { FancyTemplate } from './FancyTemplate'

interface Dish {
  _id: string
  name: string
  description?: string
  price: number
  image?: any
  category: string
  spiceLevel?: number
  dietary?: string[]
  isAvailable: boolean
  isFeatured: boolean
}

interface MenuSection {
  _id: string
  title: string
  description?: string
  order: number
  isVisible: boolean
  dishes: Dish[]
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

interface TemplateWrapperProps {
  template: 'sushi' | 'fancy'
  restaurant: Restaurant
  sections: MenuSection[]
  pageCount: number
  doubleSided: boolean
  paperSize: 'letter' | 'a4' | 'legal'
}

export function TemplateWrapper({
  template,
  restaurant,
  sections,
  pageCount,
  doubleSided,
  paperSize
}: TemplateWrapperProps) {
  const templateProps = {
    restaurant,
    sections,
    pageCount,
    doubleSided,
    paperSize
  }

  switch (template) {
    case 'sushi':
      return <SushiTemplate {...templateProps} />
    case 'fancy':
      return <FancyTemplate {...templateProps} />
    default:
      return <SushiTemplate {...templateProps} />
  }
}
