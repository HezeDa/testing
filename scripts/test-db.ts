import { Pool } from 'pg';

const pool = new Pool({
    user: "avnadmin",
    password: "AVNS_Diaaf8DAEjsaaMSXdGf",
    host: "pg-3b4de346-tricion219-17b2.k.aivencloud.com",
    port: 12372,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: false
    }
});

async function main() {
    try {
        console.log('Подключение к базе данных...');
        const client = await pool.connect();
        console.log('Подключение успешно установлено');
        
        // Проверяем таблицу users
        const users = await client.query('SELECT * FROM users');
        console.log('\nПользователи:');
        console.log(users.rows);
        
        // Проверяем таблицу properties
        const properties = await client.query('SELECT * FROM properties');
        console.log('\nОбъекты недвижимости:');
        console.log(properties.rows);
        
        // Проверяем таблицу blog_categories
        const categories = await client.query('SELECT * FROM blog_categories');
        console.log('\nКатегории блога:');
        console.log(categories.rows);
        
        // Проверяем таблицу blog_articles
        const articles = await client.query('SELECT * FROM blog_articles');
        console.log('\nСтатьи блога:');
        console.log(articles.rows);
        
    } catch (err) {
        console.error('Ошибка:', err);
    } finally {
        await pool.end();
        console.log('\nСоединение закрыто');
    }
}

main();