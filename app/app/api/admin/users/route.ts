import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { z } from "zod"
import { hash } from "bcrypt"

// Схема валидации для создания пользователя
const userSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "manager", "user"]).default("user"),
})

// GET /api/admin/users - получение списка пользователей
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    let query = `
      SELECT id, name, email, role, created_at as "createdAt"
      FROM users
      ${role ? "WHERE role = $1" : ""}
      ORDER BY created_at
    `

    const result = await pool.query(
      query,
      role ? [role] : []
    )

    return NextResponse.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при загрузке пользователей",
      },
      { status: 500 },
    )
  }
}

// POST /api/admin/users - создание нового пользователя
export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const body = await request.json()

    // Валидация данных
    const validatedData = userSchema.parse(body)

    // Проверка существования пользователя с таким email
    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [validatedData.email]
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

    // Хеширование пароля
    const hashedPassword = await hash(validatedData.password, 10)

    // Создание пользователя
    const result = await client.query(
      `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at as "createdAt"
      `,
      [validatedData.name, validatedData.email, hashedPassword, validatedData.role]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0],
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

    console.error("Error creating user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при создании пользователя",
      },
      { status: 500 },
    )
  } finally {
    client.release()
  }
} 