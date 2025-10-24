import { getImageUrl } from '@/lib/images/imageUtils'

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

interface FancyTemplateProps {
  restaurant: Restaurant
  sections: MenuSection[]
  pageCount: number
  doubleSided: boolean
  paperSize: 'letter' | 'a4' | 'legal'
}

export function FancyTemplate({ 
  restaurant, 
  sections, 
  pageCount, 
  doubleSided, 
  paperSize 
}: FancyTemplateProps) {
  const getSpiceColor = (level: number) => {
    const colors = ['#90EE90', '#FFD700', '#FFA500', '#FF6347', '#DC143C']
    return colors[level - 1] || '#90EE90'
  }

  return (
    <div className={`fancy-template paper-${paperSize} print-container`}>
      <style jsx>{`
        @media print {
          .fancy-template {
            font-family: 'Times New Roman', serif;
            line-height: 1.4;
            color: #000;
          }
          .menu-header {
            text-align: center;
            margin-bottom: 2rem;
            border-bottom: 2px solid #000;
            padding-bottom: 1rem;
          }
          .menu-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            letter-spacing: 1px;
          }
          .menu-subtitle {
            font-size: 1.2rem;
            font-style: italic;
          }
          .section-title {
            font-size: 1.5rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 1rem;
            border-bottom: 1px solid #000;
            padding-bottom: 0.5rem;
          }
          .fancy-dish {
            margin-bottom: 1.2rem;
            padding-bottom: 0.8rem;
            border-bottom: 1px dotted #ccc;
          }
          .fancy-dish:last-child {
            border-bottom: none;
          }
          .fancy-dish-name {
            font-size: 1.1rem;
            font-weight: bold;
            margin-bottom: 0.3rem;
          }
          .fancy-dish-description {
            font-size: 0.95rem;
            line-height: 1.3;
            margin-bottom: 0.5rem;
          }
          .fancy-dish-price {
            font-size: 1.1rem;
            font-weight: bold;
            text-align: right;
          }
        }
      `}</style>
      
      {/* Header */}
      <div className="menu-header">
        {restaurant.logo && (
          <img
            src={getImageUrl(restaurant.logo, 100, 100) || ''}
            alt={restaurant.name}
            className="h-16 w-auto mx-auto mb-4"
          />
        )}
        <h1 className="menu-title">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="menu-subtitle">{restaurant.description}</p>
        )}
        {restaurant.address && (
          <p className="text-sm mt-2">{restaurant.address}</p>
        )}
        {restaurant.phone && (
          <p className="text-sm">{restaurant.phone}</p>
        )}
      </div>

      {/* Menu Sections */}
      {sections
        .filter(section => section.isVisible)
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div key={section._id} className="menu-section">
            <h2 className="section-title">{section.title}</h2>
            {section.description && (
              <p className="text-sm text-gray-600 mb-4 italic">{section.description}</p>
            )}
            
            <div className="space-y-4">
              {section.dishes
                .filter(dish => dish.isAvailable)
                .map((dish) => (
                  <div key={dish._id} className="fancy-dish">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="fancy-dish-name">{dish.name}</h3>
                          {dish.isFeatured && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Chef's Special
                            </span>
                          )}
                          {dish.spiceLevel && (
                            <div
                              className="w-3 h-3 rounded-full ml-2"
                              style={{ backgroundColor: getSpiceColor(dish.spiceLevel) }}
                            />
                          )}
                        </div>
                        {dish.description && (
                          <p className="fancy-dish-description">{dish.description}</p>
                        )}
                        {dish.dietary && dish.dietary.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {dish.dietary.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-100 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="fancy-dish-price">${dish.price}</span>
                    </div>
                    {dish.image && (
                      <div className="mt-3">
                        <img
                          src={getImageUrl(dish.image, 300, 200) || ''}
                          alt={dish.name}
                          className="max-w-xs h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}
