import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    // В реальном приложении здесь должна быть проверка авторизации
    // и получение ID пользователя из сессии/токена
    const result = await pool.query(
      `SELECT name, email, phone FROM admins WHERE id = 1`
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Профиль не найден" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Ошибка при получении профиля:", error)
    return NextResponse.json(
      { error: "Ошибка при получении профиля" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: "Имя и email обязательны" },
        { status: 400 }
      )
    }

    // В реальном приложении здесь должна быть проверка авторизации
    // и получение ID пользователя из сессии/токена
    const result = await pool.query(
      `UPDATE admins 
       SET name = $1, email = $2, phone = $3, updated_at = NOW()
       WHERE id = 1
       RETURNING name, email, phone`,
      [name, email, phone]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Профиль не найден" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error)
    return NextResponse.json(
      { error: "Ошибка при обновлении профиля" },
      { status: 500 }
    )
  }
} 