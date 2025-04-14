import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "Файл не найден" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Генерируем уникальное имя файла
    const uniqueName = `${uuidv4()}-${file.name}`
    const uploadDir = join(process.cwd(), "public/uploads")
    const filePath = join(uploadDir, uniqueName)

    // Сохраняем файл
    await writeFile(filePath, buffer)

    // Возвращаем URL файла
    return NextResponse.json({
      url: `/uploads/${uniqueName}`,
    })
  } catch (error) {
    console.error("Ошибка загрузки файла:", error)
    return NextResponse.json(
      { error: "Ошибка при загрузке файла" },
      { status: 500 }
    )
  }
} 