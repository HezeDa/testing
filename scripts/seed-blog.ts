import { pool } from "../lib/db"
import { hash } from "bcrypt"

async function seed() {
  try {
    console.log("🌱 Начало заполнения базы данных...")

    // Создание администратора
    const hashedPassword = await hash("admin123", 10)
    const adminResult = await pool.query(
      `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO UPDATE SET 
         password = EXCLUDED.password,
         name = EXCLUDED.name,
         role = EXCLUDED.role
       RETURNING id`,
      ["admin@admin.com", hashedPassword, "Тестовый юзер", "admin"]
    )
    const adminId = adminResult.rows[0].id
    console.log("✅ Администратор создан")

    // Создание категорий блога
    const categories = [
      { name: "Юридические вопросы", slug: "legal" },
      { name: "Инвестиции", slug: "investment" },
      { name: "Налоги", slug: "taxes" },
      { name: "Покупка недвижимости", slug: "buying" },
      { name: "Образ жизни", slug: "lifestyle" },
      { name: "Аналитика рынка", slug: "market" },
    ]

    for (const category of categories) {
      try {
        await pool.query(
          `INSERT INTO blog_categories (name, slug) 
           VALUES ($1, $2)
           ON CONFLICT (slug) DO NOTHING`,
          [category.name, category.slug]
        )
      } catch (error) {
        console.log(`Категория ${category.name} уже существует, пропускаем...`)
      }
    }
    console.log("✅ Категории блога созданы")

    // Создание статей блога
    const articles = [
      {
        title: "Как получить гражданство Кипра через недвижимость",
        slug: "how-to-get-cyprus-citizenship",
        excerpt: "Подробное руководство по программе Golden Visa и процессу получения гражданства Кипра через инвестиции в недвижимость.",
        content: `
          <h2>Что такое программа Golden Visa?</h2>
          <p>Программа Golden Visa - это специальная программа, которая позволяет иностранным инвесторам получить вид на жительство или гражданство Кипра через инвестиции в недвижимость.</p>
          
          <h2>Основные требования</h2>
          <ul>
            <li>Инвестиции в недвижимость на сумму от €300,000</li>
            <li>Чистая криминальная история</li>
            <li>Подтверждение легальности происхождения средств</li>
            <li>Медицинская страховка</li>
          </ul>
          
          <h2>Процесс получения</h2>
          <ol>
            <li>Выбор объекта недвижимости</li>
            <li>Проверка документов</li>
            <li>Подача заявления</li>
            <li>Рассмотрение заявки</li>
            <li>Получение разрешения</li>
          </ol>
        `,
        category_id: 1,
        author_id: adminId,
        status: "published",
        featured: true,
        featured_image: "/placeholder.svg?height=800&width=1200",
        meta_title: "Как получить гражданство Кипра через недвижимость | Cyprus Elite Estates",
        meta_description: "Подробное руководство по программе Golden Visa и процессу получения гражданства Кипра через инвестиции в недвижимость.",
        meta_keywords: "гражданство Кипра, Golden Visa, инвестиции в недвижимость, вид на жительство"
      },
      {
        title: "Топ-5 районов для инвестиций в 2024 году",
        slug: "top-5-areas-for-investment",
        excerpt: "Анализ самых перспективных районов Кипра для инвестиций в недвижимость в 2024 году с учетом инфраструктуры и потенциала роста цен.",
        content: `
          <h2>1. Лимассол</h2>
          <p>Лимассол продолжает оставаться самым привлекательным городом для инвестиций благодаря развитой инфраструктуре и высокому спросу на аренду.</p>
          
          <h2>2. Пафос</h2>
          <p>Пафос предлагает отличные возможности для инвестиций в туристическую недвижимость и жилье премиум-класса.</p>
          
          <h2>3. Ларнака</h2>
          <p>С развитием нового аэропорта и порта, Ларнака становится все более привлекательной для инвесторов.</p>
          
          <h2>4. Никосия</h2>
          <p>Столица Кипра предлагает стабильный рынок недвижимости с хорошим потенциалом роста.</p>
          
          <h2>5. Айя-Напа</h2>
          <p>Туристический центр с высоким потенциалом для инвестиций в курортную недвижимость.</p>
        `,
        category_id: 2,
        author_id: adminId,
        status: "published",
        featured: false,
        featured_image: "/placeholder.svg?height=800&width=1200",
        meta_title: "Топ-5 районов для инвестиций в 2024 году | Cyprus Elite Estates",
        meta_description: "Анализ самых перспективных районов Кипра для инвестиций в недвижимость в 2024 году.",
        meta_keywords: "инвестиции в недвижимость, районы Кипра, 2024 год, Лимассол, Пафос"
      },
      {
        title: "Налоговые преимущества владения недвижимостью на Кипре",
        slug: "tax-benefits-of-cyprus-property",
        excerpt: "Подробный обзор налоговых льгот и преимуществ для владельцев недвижимости на Кипре.",
        content: `
          <h2>Налог на недвижимость</h2>
          <p>На Кипре действует одна из самых низких ставок налога на недвижимость в Европе.</p>
          
          <h2>Налог на прирост капитала</h2>
          <p>При продаже недвижимости после 5 лет владения налог на прирост капитала не взимается.</p>
          
          <h2>НДС</h2>
          <p>При покупке первой недвижимости на Кипре можно получить скидку на НДС.</p>
          
          <h2>Налог на наследство</h2>
          <p>На Кипре отсутствует налог на наследство, что делает его привлекательным для долгосрочных инвестиций.</p>
        `,
        category_id: 3,
        author_id: adminId,
        status: "published",
        featured: true,
        featured_image: "/placeholder.svg?height=800&width=1200",
        meta_title: "Налоговые преимущества владения недвижимостью на Кипре | Cyprus Elite Estates",
        meta_description: "Подробный обзор налоговых льгот и преимуществ для владельцев недвижимости на Кипре.",
        meta_keywords: "налоги на Кипре, налог на недвижимость, налоговые льготы"
      }
    ]

    for (const article of articles) {
      try {
        await pool.query(
          `INSERT INTO blog_articles (
            title, slug, excerpt, content, category_id, author_id, 
            status, featured, featured_image, meta_title, meta_description, meta_keywords
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (slug) DO NOTHING`,
          [
            article.title,
            article.slug,
            article.excerpt,
            article.content,
            article.category_id,
            article.author_id,
            article.status,
            article.featured,
            article.featured_image,
            article.meta_title,
            article.meta_description,
            article.meta_keywords
          ]
        )
      } catch (error) {
        console.log(`Статья ${article.title} уже существует, пропускаем...`)
      }
    }
    console.log("✅ Статьи блога созданы")

    console.log("✅ База данных успешно заполнена")
  } catch (error) {
    console.error("❌ Ошибка при заполнении базы данных:", error)
  } finally {
    process.exit(0)
  }
}

seed() 