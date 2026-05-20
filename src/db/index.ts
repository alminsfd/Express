import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
     connectionString: config.connectionString
})



export const initDB = async () => {
     try {
          await pool.query(`
               CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(50), -- Name er length barano hoyeche
                    email VARCHAR(100) UNIQUE NOT NULL, -- Email er length barano hoyeche
                    password VARCHAR(255) NOT NULL, -- Password er length oboshshoi besi hote hobe
                    is_active BOOLEAN DEFAULT true,
                    age INT,
                    created_at TIMESTAMP DEFAULT NOW(), -- Typo thik kora hoyeche (creat_at -> created_at)
                    updated_at TIMESTAMP DEFAULT NOW()  -- Typo thik kora hoyeche (update_at -> updated_at)
               )
          `);
          await pool.query(`
               CREATE TABLE IF NOT EXISTS prolife(
               id SERIAL PRIMARY KEY,
               user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,   
               bio TEXT,
               address TEXT,
               phone VARCHAR(12),
               gender VARCHAR(10),
               created_at TIMESTAMP DEFAULT NOW(),
               updated_at TIMESTAMP DEFAULT NOW()
               )
               `)
          console.log("Database table successfully checked/created");
     } catch (err) {
          console.error("Database initialization error:", err);
     }
}

