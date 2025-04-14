import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      )
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Пожалуйста, загружайте только изображения' },
        { status: 400 }
      )
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Размер файла не должен превышать 5MB' },
        { status: 400 }
      )
    }

    // Создаем уникальное имя файла
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${uuidv4()}-${file.name}`
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'properties')
    const filePath = join(uploadDir, fileName)

    // Создаем директорию, если она не существует
    await writeFile(filePath, buffer)

    // Возвращаем URL загруженного файла
    return NextResponse.json({
      data: {
        url: `/uploads/properties/${fileName}`
      }
    })
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error)
    return NextResponse.json(
      { error: 'Произошла ошибка при загрузке файла' },
      { status: 500 }
    )
  }
} 