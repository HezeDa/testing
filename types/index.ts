export interface Property {
  id: number
  title: string
  slug: string
  description: string
  location: string
  region: string
  price: number
  type: string
  status: string
  bedrooms: number
  bathrooms: number
  area: number
  featured: boolean
  image_url?: string
  created_at: string
  updated_at: string
}

export interface BlogArticle {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: number
  author_id: number
  status: string
  featured: boolean
  featured_image?: string
  published_at?: string
  created_at: string
  updated_at: string
  category_name?: string
  author_name?: string
} 