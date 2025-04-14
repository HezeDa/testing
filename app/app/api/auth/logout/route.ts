import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// POST /api/auth/logout - выход пользователя
export async function POST(request: NextRequest) {
  try {
    // Удаление cookie
    cookies().delete("admin_authenticated")

    return NextResponse.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Error during logout:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
