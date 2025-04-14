import { pgTable, serial, text, varchar, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Перечисления для статусов и типов
export const propertyTypeEnum = pgEnum("property_type", ["villa", "apartment", "townhouse", "penthouse"])
export const propertyStatusEnum = pgEnum("property_status", ["active", "draft", "sold", "reserved"])
export const regionEnum = pgEnum("region", ["limassol", "paphos", "protaras", "larnaca", "nicosia"])
export const articleStatusEnum = pgEnum("article_status", ["published", "draft"])
export const inquiryStatusEnum = pgEnum("inquiry_status", ["new", "in-progress", "completed"])

// Таблица пользователей
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Таблица объектов недвижимости
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  region: regionEnum("region").notNull(),
  price: integer("price").notNull(),
  type: propertyTypeEnum("type").notNull(),
  status: propertyStatusEnum("status").default("draft").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: integer("area"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Таблица изображений объектов
export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Таблица особенностей объектов
export const propertyFeatures = pgTable("property_features", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  feature: varchar("feature", { length: 255 }).notNull(),
})

// Таблица категорий блога
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
})

// Таблица статей блога
export const blogArticles = pgTable("blog_articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  categoryId: integer("category_id").references(() => blogCategories.id),
  authorId: integer("author_id").references(() => users.id),
  status: articleStatusEnum("status").default("draft").notNull(),
  featured: boolean("featured").default(false),
  featuredImage: varchar("featured_image", { length: 255 }),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Таблица заявок от клиентов
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message"),
  propertyId: integer("property_id").references(() => properties.id),
  status: inquiryStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Определение отношений
export const propertiesRelations = relations(properties, ({ many }) => ({
  images: many(propertyImages),
  features: many(propertyFeatures),
  inquiries: many(inquiries),
}))

export const blogArticlesRelations = relations(blogArticles, ({ one }) => ({
  category: one(blogCategories, {
    fields: [blogArticles.categoryId],
    references: [blogCategories.id],
  }),
  author: one(users, {
    fields: [blogArticles.authorId],
    references: [users.id],
  }),
}))
