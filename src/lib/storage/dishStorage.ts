// Utility functions for managing dishes in localStorage

export interface Dish {
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

const STORAGE_KEY = 'menu-maker-dishes'

export function getDishesFromStorage(): Dish[] {
  try {
    const storedDishes = localStorage.getItem(STORAGE_KEY)
    console.log('getDishesFromStorage: Raw data:', storedDishes)
    if (storedDishes) {
      const parsed = JSON.parse(storedDishes)
      console.log('getDishesFromStorage: Parsed dishes:', parsed.length, 'items')
      return parsed
    }
  } catch (error) {
    console.error('Failed to load dishes from storage:', error)
  }
  console.log('getDishesFromStorage: No data found')
  return []
}

export function saveDishesToStorage(dishes: Dish[]): void {
  try {
    console.log('saveDishesToStorage: Saving', dishes.length, 'dishes')
    const jsonData = JSON.stringify(dishes)
    localStorage.setItem(STORAGE_KEY, jsonData)
    console.log('saveDishesToStorage: Successfully saved to localStorage')
  } catch (error) {
    console.error('Failed to save dishes to storage:', error)
  }
}

export function addDishToStorage(dish: Dish): void {
  const existingDishes = getDishesFromStorage()
  const updatedDishes = [...existingDishes, dish]
  saveDishesToStorage(updatedDishes)
}

export function updateDishInStorage(dishId: string, updates: Partial<Dish>): void {
  const existingDishes = getDishesFromStorage()
  const updatedDishes = existingDishes.map(dish =>
    dish._id === dishId ? { ...dish, ...updates } : dish
  )
  saveDishesToStorage(updatedDishes)
}

export function deleteDishFromStorage(dishId: string): void {
  const existingDishes = getDishesFromStorage()
  const updatedDishes = existingDishes.filter(dish => dish._id !== dishId)
  saveDishesToStorage(updatedDishes)
}

export function clearAllDishesFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear dishes from storage:', error)
  }
}
