import { type NextRequest, NextResponse } from "next/server"
import { compare } from "bcrypt"
import { cookies } from "next/headers"
import { z } from "zod"
import { pool } from "@/lib/db"

// Схема валидации для входа
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// POST /api/auth/login - аутентификация пользователя
export async function POST(request: NextRequest) {
  try {
    console.log("Получен запрос на вход")
    const body = await request.json()
    console.log("Данные запроса:", { email: body.email, passwordProvided: !!body.password })

    // Валидация данных
    const { email, password } = loginSchema.parse(body)

    // Поиск пользователя по email
    console.log("Поиск пользователя в базе данных...")
    const { rows } = await pool.query(
      'SELECT id, email, name, role, password FROM users WHERE email = $1',
      [email]
    )
    const user = rows[0]
    console.log("Пользователь найден:", !!user)

    // Если пользователь не найден или пароль неверный
    if (!user) {
      console.log("Пользователь не найден")
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
    }

    // Проверка пароля
    const passwordMatch = await compare(password, user.password)
    console.log("Пароль совпадает:", passwordMatch)

    if (!passwordMatch) {
      console.log("Неверный пароль")
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
    }

    // Создаем объект ответа
    const { password: _, ...userWithoutPassword } = user
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Вход выполнен успешно"
    })

    // Установка cookie для аутентификации
    console.log("Установка cookie для аутентификации")
    response.cookies.set({
      name: "admin_authenticated",
      value: "true",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 день
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    // Установка дополнительных cookie с информацией о пользователе
    response.cookies.set({
      name: "user_role",
      value: user.role,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    response.cookies.set({
      name: "user_id",
      value: user.id.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    console.log("Вход успешен, возвращаем данные пользователя")
    return response

  } catch (error) {
    console.error("Ошибка при входе:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ 
      success: false,
      error: "Ошибка аутентификации", 
      details: String(error) 
    }, { status: 500 })
  }
}
