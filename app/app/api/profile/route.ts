import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { hash } from "bcrypt"
import { z } from "zod"

// Схема валидации для обновления профиля
const updateProfileSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
})

// GET /api/profile - получение данных профиля
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("user_id")?.value

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Пользователь не авторизован",
        },
        { status: 401 },
      )
    }

    const result = await pool.query(
      `
        SELECT id, name, email, role, created_at as "createdAt"
        FROM users
        WHERE id = $1
      `,
      [userId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Пользователь не найден",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при загрузке профиля",
      },
      { status: 500 },
    )
  }
}

// PUT /api/profile - обновление профиля
export async function PUT(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const userId = request.cookies.get("user_id")?.value

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Пользователь не авторизован",
        },
        { status: 401 },
      )
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // Проверка существования email у другого пользователя
    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [validatedData.email, userId]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Пользователь с таким email уже существует",
        },
        { status: 400 },
      )
    }

    // Если пользователь меняет пароль
    if (validatedData.currentPassword && validatedData.newPassword) {
      // Проверка текущего пароля
      const user = await client.query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
      )

      if (user.rows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Пользователь не найден",
          },
          { status: 404 },
        )
      }

      const isPasswordValid = await compare(
        validatedData.currentPassword,
        user.rows[0].password
      )

      if (!isPasswordValid) {
        return NextResponse.json(
          {
            success: false,
            error: "Неверный текущий пароль",
          },
          { status: 400 },
        )
      }

      // Обновление с новым паролем
      const hashedPassword = await hash(validatedData.newPassword, 10)
      await client.query(
        `
          UPDATE users
          SET name = $1, email = $2, password = $3, updated_at = NOW()
          WHERE id = $4
        `,
        [validatedData.name, validatedData.email, hashedPassword, userId]
      )
    } else {
      // Обновление без изменения пароля
      await client.query(
        `
          UPDATE users
          SET name = $1, email = $2, updated_at = NOW()
          WHERE id = $3
        `,
        [validatedData.name, validatedData.email, userId]
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Некорректные данные",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("Error updating profile:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при обновлении профиля",
      },
      { status: 500 },
    )
  } finally {
    client.release()
  }
} 