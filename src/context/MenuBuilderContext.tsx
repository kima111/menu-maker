'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

// Types
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

interface Menu {
  _id?: string
  title: string
  template: 'sushi' | 'fancy'
  pageCount: number
  doubleSided: boolean
  paperSize: 'letter' | 'a4' | 'legal'
  sections: MenuSection[]
  isPublished: boolean
}

interface MenuBuilderState {
  currentMenu: Menu | null
  isLoading: boolean
  error: string | null
}

type MenuBuilderAction =
  | { type: 'SET_MENU'; payload: Menu }
  | { type: 'UPDATE_MENU'; payload: Partial<Menu> }
  | { type: 'ADD_SECTION'; payload: MenuSection }
  | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<MenuSection> } }
  | { type: 'DELETE_SECTION'; payload: string }
  | { type: 'ADD_DISH'; payload: { sectionId: string; dish: Dish } }
  | { type: 'UPDATE_DISH'; payload: { sectionId: string; dishId: string; updates: Partial<Dish> } }
  | { type: 'DELETE_DISH'; payload: { sectionId: string; dishId: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: MenuBuilderState = {
  currentMenu: null,
  isLoading: false,
  error: null
}

function menuBuilderReducer(state: MenuBuilderState, action: MenuBuilderAction): MenuBuilderState {
  switch (action.type) {
    case 'SET_MENU':
      return {
        ...state,
        currentMenu: action.payload,
        error: null
      }
    
    case 'UPDATE_MENU':
      return {
        ...state,
        currentMenu: state.currentMenu ? { ...state.currentMenu, ...action.payload } : null
      }
    
    case 'ADD_SECTION':
      return {
        ...state,
        currentMenu: state.currentMenu ? {
          ...state.currentMenu,
          sections: [...state.currentMenu.sections, action.payload]
        } : null
      }
    
    case 'UPDATE_SECTION':
      return {
        ...state,
        currentMenu: state.currentMenu ? {
          ...state.currentMenu,
          sections: state.currentMenu.sections.map(section =>
            section._id === action.payload.id
              ? { ...section, ...action.payload.updates }
              : section
          )
        } : null
      }
    
    case 'DELETE_SECTION':
      return {
        ...state,
        currentMenu: state.currentMenu ? {
          ...state.currentMenu,
          sections: state.currentMenu.sections.filter(section => section._id !== action.payload)
        } : null
      }
    
    case 'ADD_DISH':
      return {
        ...state,
        currentMenu: state.currentMenu ? {
          ...state.currentMenu,
          sections: state.currentMenu.sections.map(section =>
            section._id === action.payload.sectionId
              ? { ...section, dishes: [...section.dishes, action.payload.dish] }
              : section
          )
        } : null
      }
    
    case 'UPDATE_DISH':
      return {
        ...state,
        currentMenu: state.currentMenu ? {
          ...state.currentMenu,
          sections: state.currentMenu.sections.map(section =>
            section._id === action.payload.sectionId
              ? {
                  ...section,
                  dishes: section.dishes.map(dish =>
                    dish._id === action.payload.dishId
                      ? { ...dish, ...action.payload.updates }
                      : dish
                  )
                }
              : section
          )
        } : null
      }
    
    case 'DELETE_DISH':
      return {
        ...state,
        currentMenu: state.currentMenu ? {
          ...state.currentMenu,
          sections: state.currentMenu.sections.map(section =>
            section._id === action.payload.sectionId
              ? {
                  ...section,
                  dishes: section.dishes.filter(dish => dish._id !== action.payload.dishId)
                }
              : section
          )
        } : null
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    
    default:
      return state
  }
}

interface MenuBuilderContextType {
  state: MenuBuilderState
  dispatch: React.Dispatch<MenuBuilderAction>
  // Helper functions
  setMenu: (menu: Menu) => void
  updateMenu: (updates: Partial<Menu>) => void
  addSection: (section: MenuSection) => void
  updateSection: (id: string, updates: Partial<MenuSection>) => void
  deleteSection: (id: string) => void
  addDish: (sectionId: string, dish: Dish) => void
  updateDish: (sectionId: string, dishId: string, updates: Partial<Dish>) => void
  deleteDish: (sectionId: string, dishId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const MenuBuilderContext = createContext<MenuBuilderContextType | undefined>(undefined)

export function MenuBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(menuBuilderReducer, initialState)

  const setMenu = (menu: Menu) => {
    dispatch({ type: 'SET_MENU', payload: menu })
  }

  const updateMenu = (updates: Partial<Menu>) => {
    dispatch({ type: 'UPDATE_MENU', payload: updates })
  }

  const addSection = (section: MenuSection) => {
    dispatch({ type: 'ADD_SECTION', payload: section })
  }

  const updateSection = (id: string, updates: Partial<MenuSection>) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { id, updates } })
  }

  const deleteSection = (id: string) => {
    dispatch({ type: 'DELETE_SECTION', payload: id })
  }

  const addDish = (sectionId: string, dish: Dish) => {
    dispatch({ type: 'ADD_DISH', payload: { sectionId, dish } })
  }

  const updateDish = (sectionId: string, dishId: string, updates: Partial<Dish>) => {
    dispatch({ type: 'UPDATE_DISH', payload: { sectionId, dishId, updates } })
  }

  const deleteDish = (sectionId: string, dishId: string) => {
    dispatch({ type: 'DELETE_DISH', payload: { sectionId, dishId } })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const value: MenuBuilderContextType = {
    state,
    dispatch,
    setMenu,
    updateMenu,
    addSection,
    updateSection,
    deleteSection,
    addDish,
    updateDish,
    deleteDish,
    setLoading,
    setError
  }

  return (
    <MenuBuilderContext.Provider value={value}>
      {children}
    </MenuBuilderContext.Provider>
  )
}

export function useMenuBuilder() {
  const context = useContext(MenuBuilderContext)
  if (context === undefined) {
    throw new Error('useMenuBuilder must be used within a MenuBuilderProvider')
  }
  return context
}
