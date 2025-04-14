import { Pool } from 'pg';

const pool = new Pool({
    user: "avnadmin",
    password: "AVNS_Diaaf8DAEjsaaMSXdGf",
    host: "pg-3b4de346-tricion219-17b2.k.aivencloud.com",
    port: 12372,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20
});

export { pool }; 