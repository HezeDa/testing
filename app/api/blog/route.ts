import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { blogArticles, blogCategories, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { pool } from "@/lib/db"

// Схема валидации для создания статьи
const articleSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  excerpt: z.string().optional(),
  content: z.string(),
  categoryId: z.number().optional(),
  authorId: z.number(),
  status: z.enum(["published", "draft"]).default("draft"),
  featured: z.boolean().default(false),
  featuredImage: z.string().optional(),
  publishedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
})

// GET /api/blog - получение списка статей
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status") || "published"

    let query = `
      SELECT 
        ba.*,
        bc.name as category_name,
        u.name as author_name
      FROM blog_articles ba
      LEFT JOIN blog_categories bc ON ba.category_id = bc.id
      LEFT JOIN users u ON ba.author_id = u.id
      WHERE ba.status = $1
    `
    const queryParams: any[] = [status]
    let paramCount = 2

    if (category) {
      query += ` AND bc.slug = $${paramCount}`
      queryParams.push(category)
      paramCount++
    }

    query += " ORDER BY ba.created_at DESC"

    const result = await pool.query(query, queryParams)

    return NextResponse.json({
      success: true,
      data: result.rows.map(article => ({
        ...article,
        date: new Date(article.created_at).toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }))
    })
  } catch (error) {
    console.error("Error fetching blog articles:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при получении списка статей",
      },
      { status: 500 }
    )
  }
}

// POST /api/blog - создание новой статьи
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация данных
    const validatedData = articleSchema.parse(body)

    // Создание статьи
    const [newArticle] = await db.insert(blogArticles).values(validatedData).returning()

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
