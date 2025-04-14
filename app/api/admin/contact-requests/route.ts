import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET /api/admin/contact-requests - получение списка заявок
export async function GET(request: NextRequest) {
  try {
    console.log("Получен запрос на получение списка заявок")
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    console.log("Параметры пагинации:", { page, limit, offset })

    // Получаем общее количество заявок
    const countResult = await pool.query("SELECT COUNT(*) FROM contact_requests")
    const total = parseInt(countResult.rows[0].count)
    console.log("Всего заявок:", total)

    // Получаем заявки с пагинацией
    const result = await pool.query(
      `SELECT * FROM contact_requests
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    console.log("Получено заявок:", result.rows.length)

    return NextResponse.json({
      requests: result.rows,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    })
  } catch (error) {
    console.error("Ошибка при получении заявок:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при получении заявок" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/contact-requests - обновление заявки
export async function PUT(request: NextRequest) {
  try {
    console.log("Получен запрос на обновление заявки")
    const { id, status, notes } = await request.json()
    console.log("Данные для обновления:", { id, status, notes })

    if (!id || !status) {
      console.log("Ошибка: отсутствуют обязательные поля")
      return NextResponse.json(
        { error: "ID и статус обязательны" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `UPDATE contact_requests
       SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, notes, id]
    )

    if (result.rows.length === 0) {
      console.log("Заявка не найдена")
      return NextResponse.json(
        { error: "Заявка не найдена" },
        { status: 404 }
      )
    }

    console.log("Заявка успешно обновлена")
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Ошибка при обновлении заявки:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при обновлении заявки" },
      { status: 500 }
    )
  }
} 