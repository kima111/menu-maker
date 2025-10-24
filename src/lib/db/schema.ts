import { pgTable, text, timestamp, uuid, decimal, boolean, integer, json } from 'drizzle-orm/pg-core'

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address'),
  phone: text('phone'),
  website: text('website'),
  logo: text('logo'), // URL to image stored in Vercel Blob
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').notNull(), // User ID from auth
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const dishes = pgTable('dishes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }),
  image: text('image'), // URL to image stored in Vercel Blob
  category: text('category'),
  spiceLevel: integer('spice_level').default(1),
  dietary: json('dietary').$type<string[]>().default([]),
  isAvailable: boolean('is_available').default(true),
  isFeatured: boolean('is_featured').default(false),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const menuSections = pgTable('menu_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  isVisible: boolean('is_visible').default(true),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const menus = pgTable('menus', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  template: text('template').notNull().default('fancy'),
  pageCount: integer('page_count').default(1),
  doubleSided: boolean('double_sided').default(false),
  paperSize: text('paper_size').default('A4'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  slug: text('slug').notNull().unique(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const menuSectionDishes = pgTable('menu_section_dishes', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuSectionId: uuid('menu_section_id').references(() => menuSections.id).notNull(),
  dishId: uuid('dish_id').references(() => dishes.id).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const menuSectionsInMenus = pgTable('menu_sections_in_menus', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuId: uuid('menu_id').references(() => menus.id).notNull(),
  menuSectionId: uuid('menu_section_id').references(() => menuSections.id).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Type exports for TypeScript
export type Restaurant = typeof restaurants.$inferSelect
export type NewRestaurant = typeof restaurants.$inferInsert
export type Dish = typeof dishes.$inferSelect
export type NewDish = typeof dishes.$inferInsert
export type MenuSection = typeof menuSections.$inferSelect
export type NewMenuSection = typeof menuSections.$inferInsert
export type Menu = typeof menus.$inferSelect
export type NewMenu = typeof menus.$inferInsert
export type MenuSectionDish = typeof menuSectionDishes.$inferSelect
export type NewMenuSectionDish = typeof menuSectionDishes.$inferInsert
export type MenuSectionInMenu = typeof menuSectionsInMenus.$inferSelect
export type NewMenuSectionInMenu = typeof menuSectionsInMenus.$inferInsert
