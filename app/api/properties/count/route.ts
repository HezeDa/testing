import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { properties } from "@/lib/schema"
import { count } from "drizzle-orm"

export async function GET() {
  try {
    // Получаем количество объектов недвижимости
    const result = await db.select({ value: count() }).from(properties)
    const propertiesCount = result[0].value

    return NextResponse.json({ count: propertiesCount })
  } catch (error) {
    console.error("Error fetching properties count:", error)
    return NextResponse.json({ error: "Failed to fetch properties count" }, { status: 500 })
  }
}
