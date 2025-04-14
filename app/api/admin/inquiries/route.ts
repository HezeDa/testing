import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET /api/admin/inquiries - получение списка заявок
export async function GET(request: NextRequest) {
  try {
    // Получаем параметры пагинации
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = parseInt(searchParams.get("limit") || "10")

    // Вычисляем offset
    const offset = (page - 1) * limit

    // Получаем общее количество заявок
    const countResult = await pool.query("SELECT COUNT(*) FROM inquiries")
    const total = parseInt(countResult.rows[0].count)

    // Получаем заявки с пагинацией
    const result = await pool.query(
      `SELECT * FROM inquiries
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    return NextResponse.json({
      inquiries: result.rows,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    })
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json(
      { error: "Ошибка при получении заявок" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/inquiries - обновление заявки
export async function PUT(request: NextRequest) {
  try {
    const { id, status, notes } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: "Необходимо указать id и status" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `UPDATE inquiries
       SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, notes, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Заявка не найдена" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating inquiry:", error)
    return NextResponse.json(
      { error: "Ошибка при обновлении заявки" },
      { status: 500 }
    )
  }
} 