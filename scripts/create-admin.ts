import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { hash } from "bcrypt"

async function createAdmin() {
  try {
    console.log("🔑 Создание администратора...")

    // Создание администратора
    const hashedPassword = await hash("admin123", 10)

    // Проверяем, существует ли уже администратор
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, "admin@cypruseliteestates.com"),
    })

    if (existingAdmin) {
      console.log("✅ Администратор уже существует")
      return
    }

    const [admin] = await db
      .insert(users)
      .values({
        name: "Администратор",
        email: "admin@cypruseliteestates.com",
        password: hashedPassword,
        role: "admin",
      })
      .returning()

    console.log("✅ Администратор успешно создан:", admin)
  } catch (error) {
    console.error("❌ Ошибка при создании администратора:", error)
  } finally {
    process.exit(0)
  }
}

createAdmin()
