import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT maintenance_mode FROM settings WHERE id = 1`
    )
    return NextResponse.json({
      maintenance_mode: result.rows[0]?.maintenance_mode || false
    })
  } catch (error) {
    console.error("Error checking maintenance mode:", error)
    return NextResponse.json({ maintenance_mode: false })
  }
} 