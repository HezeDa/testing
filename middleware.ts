import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")
  const isLoginRoute = request.nextUrl.pathname === "/admin/login"

  // Проверяем режим обслуживания только для публичных маршрутов
  if (!isAdminRoute && !isApiRoute) {
    try {
      const maintenanceResponse = await fetch(
        new URL("/api/maintenance", request.url)
      )
      const { maintenance_mode } = await maintenanceResponse.json()

      if (maintenance_mode) {
        return NextResponse.rewrite(new URL("/maintenance", request.url))
      }
    } catch (error) {
      console.error("Error checking maintenance mode:", error)
    }
  }

  // Проверка авторизации для админки
  if (isAdminRoute && !isLoginRoute) {
    const authCookie = request.cookies.get("admin_authenticated")
    
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Если пользователь авторизован и пытается зайти на страницу логина
  if (isLoginRoute) {
    const token = request.cookies.get("admin_authenticated")

    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
