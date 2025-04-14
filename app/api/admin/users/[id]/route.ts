import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
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

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0])

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
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0])

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
      const emailExists = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email))
        .then((res) => res[0])

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
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })

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
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0])

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
      const adminCount = await db
        .select()
        .from(users)
        .where(eq(users.role, "admin"))
        .then((res) => res.length)

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
    await db.delete(users).where(eq(users.id, id))

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