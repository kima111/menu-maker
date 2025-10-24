import { db } from './config'
import { 
  restaurants, 
  dishes, 
  menuSections, 
  menus, 
  menuSectionDishes, 
  menuSectionsInMenus,
  type Restaurant,
  type NewRestaurant,
  type Dish,
  type NewDish,
  type MenuSection,
  type NewMenuSection,
  type Menu,
  type NewMenu
} from './schema'
import { eq, desc, asc, and } from 'drizzle-orm'

// Helper function to check if database is available
function checkDatabase() {
  if (!db) {
    throw new Error('Database not configured. Please set DATABASE_URL environment variable.')
  }
}

// Restaurant operations
export async function getRestaurants(ownerId?: string) {
  checkDatabase()
  if (ownerId) {
    return await db!.select().from(restaurants).where(eq(restaurants.ownerId, ownerId)).orderBy(desc(restaurants.createdAt))
  }
  return await db!.select().from(restaurants).orderBy(desc(restaurants.createdAt))
}

export async function getRestaurantById(id: string) {
  checkDatabase()
  const result = await db!.select().from(restaurants).where(eq(restaurants.id, id)).limit(1)
  return result[0] || null
}

export async function getRestaurantBySlug(slug: string) {
  checkDatabase()
  const result = await db!.select().from(restaurants).where(eq(restaurants.slug, slug)).limit(1)
  return result[0] || null
}

export async function createRestaurant(data: NewRestaurant) {
  checkDatabase()
  const result = await db!.insert(restaurants).values(data).returning()
  return result[0]
}

export async function updateRestaurant(id: string, data: Partial<NewRestaurant>) {
  checkDatabase()
  const result = await db!.update(restaurants)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(restaurants.id, id))
    .returning()
  return result[0]
}

export async function deleteRestaurant(id: string) {
  checkDatabase()
  await db!.delete(restaurants).where(eq(restaurants.id, id))
}

// Dish operations
export async function getDishes(restaurantId?: string) {
  checkDatabase()
  if (restaurantId) {
    return await db!.select().from(dishes).where(eq(dishes.restaurantId, restaurantId)).orderBy(asc(dishes.name))
  }
  return await db!.select().from(dishes).orderBy(asc(dishes.name))
}

export async function getDishById(id: string) {
  checkDatabase()
  const result = await db!.select().from(dishes).where(eq(dishes.id, id)).limit(1)
  return result[0] || null
}

export async function createDish(data: NewDish) {
  checkDatabase()
  const result = await db!.insert(dishes).values(data).returning()
  return result[0]
}

export async function updateDish(id: string, data: Partial<NewDish>) {
  checkDatabase()
  const result = await db!.update(dishes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(dishes.id, id))
    .returning()
  return result[0]
}

export async function deleteDish(id: string) {
  checkDatabase()
  await db!.delete(dishes).where(eq(dishes.id, id))
}

// Menu Section operations
export async function getMenuSections(restaurantId?: string) {
  checkDatabase()
  if (restaurantId) {
    return await db!.select().from(menuSections).where(eq(menuSections.restaurantId, restaurantId)).orderBy(asc(menuSections.order))
  }
  return await db!.select().from(menuSections).orderBy(asc(menuSections.order))
}

export async function getMenuSectionById(id: string) {
  checkDatabase()
  const result = await db!.select().from(menuSections).where(eq(menuSections.id, id)).limit(1)
  return result[0] || null
}

export async function createMenuSection(data: NewMenuSection) {
  checkDatabase()
  const result = await db!.insert(menuSections).values(data).returning()
  return result[0]
}

export async function updateMenuSection(id: string, data: Partial<NewMenuSection>) {
  checkDatabase()
  const result = await db!.update(menuSections)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(menuSections.id, id))
    .returning()
  return result[0]
}

export async function deleteMenuSection(id: string) {
  checkDatabase()
  await db!.delete(menuSections).where(eq(menuSections.id, id))
}

// Menu operations
export async function getMenus(restaurantId?: string) {
  checkDatabase()
  if (restaurantId) {
    return await db!.select().from(menus).where(eq(menus.restaurantId, restaurantId)).orderBy(desc(menus.createdAt))
  }
  return await db!.select().from(menus).orderBy(desc(menus.createdAt))
}

export async function getMenuById(id: string) {
  checkDatabase()
  const result = await db!.select().from(menus).where(eq(menus.id, id)).limit(1)
  return result[0] || null
}

export async function getMenuBySlug(slug: string) {
  checkDatabase()
  const result = await db!.select().from(menus).where(eq(menus.slug, slug)).limit(1)
  return result[0] || null
}

export async function createMenu(data: NewMenu) {
  checkDatabase()
  const result = await db!.insert(menus).values(data).returning()
  return result[0]
}

export async function updateMenu(id: string, data: Partial<NewMenu>) {
  checkDatabase()
  const result = await db!.update(menus)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(menus.id, id))
    .returning()
  return result[0]
}

export async function deleteMenu(id: string) {
  checkDatabase()
  await db!.delete(menus).where(eq(menus.id, id))
}

// Menu Section Dish operations
export async function addDishToMenuSection(menuSectionId: string, dishId: string, order: number) {
  checkDatabase()
  const result = await db!.insert(menuSectionDishes).values({
    menuSectionId,
    dishId,
    order
  }).returning()
  return result[0]
}

export async function removeDishFromMenuSection(menuSectionId: string, dishId: string) {
  checkDatabase()
  await db!.delete(menuSectionDishes)
    .where(
      and(
        eq(menuSectionDishes.menuSectionId, menuSectionId),
        eq(menuSectionDishes.dishId, dishId)
      )
    )
}

export async function getDishesInMenuSection(menuSectionId: string) {
  checkDatabase()
  return await db!.select()
    .from(menuSectionDishes)
    .innerJoin(dishes, eq(menuSectionDishes.dishId, dishes.id))
    .where(eq(menuSectionDishes.menuSectionId, menuSectionId))
    .orderBy(asc(menuSectionDishes.order))
}

// Menu Section in Menu operations
export async function addMenuSectionToMenu(menuId: string, menuSectionId: string, order: number) {
  checkDatabase()
  const result = await db!.insert(menuSectionsInMenus).values({
    menuId,
    menuSectionId,
    order
  }).returning()
  return result[0]
}

export async function removeMenuSectionFromMenu(menuId: string, menuSectionId: string) {
  checkDatabase()
  await db!.delete(menuSectionsInMenus)
    .where(
      and(
        eq(menuSectionsInMenus.menuId, menuId),
        eq(menuSectionsInMenus.menuSectionId, menuSectionId)
      )
    )
}

export async function getMenuSectionsInMenu(menuId: string) {
  checkDatabase()
  return await db!.select()
    .from(menuSectionsInMenus)
    .innerJoin(menuSections, eq(menuSectionsInMenus.menuSectionId, menuSections.id))
    .where(eq(menuSectionsInMenus.menuId, menuId))
    .orderBy(asc(menuSectionsInMenus.order))
}
