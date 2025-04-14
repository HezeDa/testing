import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { hash } from "bcrypt"

// Схема валидации для обновления пользователя
const updateUserSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["admin", "manager", "user"]).optional(),
})

// GET /api/admin/users/[id] - получение пользователя по ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const user = await pool
      .query(
        `SELECT id, name, email, role, "createdAt" 
         FROM users 
         WHERE id = $1`,
        [id]
      )
      .then((res) => res.rows[0])

    if (!user) {
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
      data: user,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при загрузке пользователя",
      },
      { status: 500 },
    )
  }
}

// PATCH /api/admin/users/[id] - обновление пользователя
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    // Валидация данных
    const validatedData = updateUserSchema.parse(body)

    // Проверка существования пользователя
    const existingUser = await pool
      .query('SELECT * FROM users WHERE id = $1', [id])
      .then((res) => res.rows[0])

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Пользователь не найден",
        },
        { status: 404 },
      )
    }

    // Проверка email на уникальность, если он изменяется
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await pool
        .query('SELECT * FROM users WHERE email = $1', [validatedData.email])
        .then((res) => res.rows[0])

      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            error: "Пользователь с таким email уже существует",
          },
          { status: 400 },
        )
      }
    }

    // Подготовка данных для обновления
    const updateData: any = { ...validatedData }
    if (validatedData.password) {
      updateData.password = await hash(validatedData.password, 10)
    }

    // Обновление пользователя
    const [updatedUser] = await pool
      .query(
        `UPDATE users 
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             password = COALESCE($3, password),
             role = COALESCE($4, role),
             "updatedAt" = NOW()
         WHERE id = $5
         RETURNING id, name, email, role, "createdAt"`,
        [
          updateData.name,
          updateData.email,
          updateData.password,
          updateData.role,
          id
        ]
      )
      .then((res) => res.rows)

    return NextResponse.json({
      success: true,
      data: updatedUser,
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

    console.error("Error updating user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при обновлении пользователя",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/admin/users/[id] - удаление пользователя
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Проверка существования пользователя
    const existingUser = await pool
      .query('SELECT * FROM users WHERE id = $1', [id])
      .then((res) => res.rows[0])

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Пользователь не найден",
        },
        { status: 404 },
      )
    }

    // Проверка, не является ли пользователь последним администратором
    if (existingUser.role === "admin") {
      const adminCount = await pool
        .query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin'])
        .then((res) => parseInt(res.rows[0].count))

      if (adminCount === 1) {
        return NextResponse.json(
          {
            success: false,
            error: "Невозможно удалить последнего администратора",
          },
          { status: 400 },
        )
      }
    }

    // Удаление пользователя
    await pool.query('DELETE FROM users WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при удалении пользователя",
      },
      { status: 500 },
    )
  }
} 