import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const { slug } = params

    const { rows: [article] } = await pool.query(`
      SELECT 
        b.*,
        c.name as category_name,
        c.id as category_id
      FROM blog_articles b
      LEFT JOIN blog_categories c ON b.category_id = c.id
      WHERE b.slug = $1
    `, [slug])

    if (!article) {
      return NextResponse.json({
        success: false,
        error: "Статья не найдена"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    console.error("Ошибка при получении статьи:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при получении статьи",
      details: String(error)
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const { slug } = params
    const body = await request.json()

    // Начинаем транзакцию
    await pool.query('BEGIN')

    // Обновляем статью
    const { rows: [article] } = await pool.query(`
      UPDATE blog_articles SET
        title = $1,
        slug = $2,
        content = $3,
        excerpt = $4,
        category_id = $5,
        status = $6,
        featured = $7,
        featured_image = $8,
        meta_title = $9,
        meta_description = $10,
        meta_keywords = $11,
        updated_at = NOW()
      WHERE slug = $12
      RETURNING *
    `, [
      body.title,
      body.slug,
      body.content,
      body.excerpt,
      body.category_id,
      body.status,
      body.featured,
      body.featured_image,
      body.meta_title,
      body.meta_description,
      body.meta_keywords,
      slug
    ])

    if (!article) {
      await pool.query('ROLLBACK')
      return NextResponse.json({
        success: false,
        error: "Статья не найдена"
      }, { status: 404 })
    }

    // Подтверждаем транзакцию
    await pool.query('COMMIT')

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await pool.query('ROLLBACK')
    
    console.error("Ошибка при обновлении статьи:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при обновлении статьи",
      details: String(error)
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const { slug } = params

    // Начинаем транзакцию
    await pool.query('BEGIN')

    // Удаляем статью
    const { rowCount } = await pool.query('DELETE FROM blog_articles WHERE slug = $1', [slug])

    if (rowCount === 0) {
      await pool.query('ROLLBACK')
      return NextResponse.json({
        success: false,
        error: "Статья не найдена"
      }, { status: 404 })
    }

    // Подтверждаем транзакцию
    await pool.query('COMMIT')

    return NextResponse.json({
      success: true,
      message: "Статья успешно удалена"
    })

  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await pool.query('ROLLBACK')
    
    console.error("Ошибка при удалении статьи:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при удалении статьи",
      details: String(error)
    }, { status: 500 })
  }
} 