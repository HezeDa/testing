import { pgTable, serial, text, varchar, integer, boolean, timestamp, date } from 'drizzle-orm/pg-core';

// Типы для полей
export const propertyRegions = ['limassol', 'paphos', 'protaras', 'larnaca', 'nicosia'] as const;
export const propertyTypes = ['villa', 'apartment', 'house', 'land'] as const;
export const propertyStatuses = ['active', 'sold', 'pending'] as const;
export const articleStatuses = ['draft', 'published'] as const;

// Таблица пользователей
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Таблица объектов недвижимости
export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  region: varchar('region', { length: 50, enum: propertyRegions }).notNull(),
  price: integer('price').notNull(),
  type: varchar('type', { length: 50, enum: propertyTypes }).notNull(),
  status: varchar('status', { length: 50, enum: propertyStatuses }).notNull().default('active'),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  area: integer('area').notNull(),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Таблица изображений объектов
export const propertyImages = pgTable('property_images', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => properties.id).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  alt: varchar('alt', { length: 255 }),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Таблица особенностей объектов
export const propertyFeatures = pgTable('property_features', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => properties.id).notNull(),
  feature: varchar('feature', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Таблица категорий блога
export const blogCategories = pgTable('blog_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Таблица статей блога
export const blogArticles = pgTable('blog_articles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  categoryId: integer('category_id').references(() => blogCategories.id).notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  status: varchar('status', { length: 50, enum: articleStatuses }).notNull().default('draft'),
  featured: boolean('featured').default(false),
  featuredImage: varchar('featured_image', { length: 255 }),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 