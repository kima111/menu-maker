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

interface SushiTemplateProps {
  restaurant: Restaurant
  sections: MenuSection[]
  pageCount: number
  doubleSided: boolean
  paperSize: 'letter' | 'a4' | 'legal'
}

export function SushiTemplate({ 
  restaurant, 
  sections, 
  pageCount, 
  doubleSided, 
  paperSize 
}: SushiTemplateProps) {
  const getSpiceColor = (level: number) => {
    const colors = ['#90EE90', '#FFD700', '#FFA500', '#FF6347', '#DC143C']
    return colors[level - 1] || '#90EE90'
  }

  const renderDishImage = (dish: Dish) => {
    if (dish.image) {
      return (
        <img
          src={getImageUrl(dish.image, 200, 120) || ''}
          alt={dish.name}
          className="w-full h-24 object-cover rounded"
        />
      )
    }
    return (
      <div className="w-full h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 text-sm">
        Photo
      </div>
    )
  }

  return (
    <div className={`sushi-template paper-${paperSize} print-container`}>
      <style jsx>{`
        @media print {
          .sushi-template {
            font-family: 'Helvetica Neue', Arial, sans-serif;
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
          }
          .menu-subtitle {
            font-size: 1.2rem;
            font-style: italic;
          }
          .sushi-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
          .sushi-item {
            border: 1px solid #ddd;
            padding: 0.8rem;
            text-align: center;
          }
          .dish-price {
            font-weight: bold;
            font-size: 1rem;
            color: #000;
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
              <p className="text-sm text-gray-600 mb-4">{section.description}</p>
            )}
            
            <div className="sushi-grid">
              {section.dishes
                .filter(dish => dish.isAvailable)
                .map((dish) => (
                  <div key={dish._id} className="sushi-item">
                    {renderDishImage(dish)}
                    <h3 className="font-bold text-lg mt-2">{dish.name}</h3>
                    {dish.description && (
                      <p className="text-sm text-gray-600 mt-1">{dish.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        {dish.spiceLevel && (
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: getSpiceColor(dish.spiceLevel) }}
                          />
                        )}
                        {dish.dietary && dish.dietary.length > 0 && (
                          <div className="flex gap-1">
                            {dish.dietary.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-100 px-1 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="dish-price">${dish.price}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}
