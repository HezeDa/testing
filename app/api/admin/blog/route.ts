import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT 
        b.*,
        c.name as category
      FROM blog_articles b
      LEFT JOIN blog_categories c ON b.category_id = c.id
      ORDER BY b.created_at DESC
    `)

    return NextResponse.json({
      success: true,
      data: rows
    })

  } catch (error) {
    console.error("Ошибка при получении статей:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при получении статей",
      details: String(error)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Начинаем транзакцию
    await pool.query('BEGIN')

    // Создаем статью
    const { rows: [article] } = await pool.query(`
      INSERT INTO blog_articles (
        title,
        slug,
        content,
        category_id,
        status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `, [
      body.title,
      body.slug,
      body.content,
      body.category_id,
      body.status || 'draft'
    ])

    // Подтверждаем транзакцию
    await pool.query('COMMIT')

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await pool.query('ROLLBACK')
    
    console.error("Ошибка при создании статьи:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при создании статьи",
      details: String(error)
    }, { status: 500 })
  }
} 