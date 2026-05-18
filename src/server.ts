import express, { type Application, type Request, type Response } from "express"
import { Pool } from 'pg'
const app: Application = express()
const port = 5000
app.use(express.json())
const pool = new Pool({
     connectionString: "postgresql://neondb_owner:npg_DU0YlmXBAqV8@ep-empty-art-aqy42gck.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
})
// app.use(express.text())
// app.use(express.urlencoded({ extended: true }))

const initDB = async () => {
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
          console.log("Database table successfully checked/created");
     } catch (err) {
          console.error("Database initialization error:", err);
     }
}

initDB();

app.get('/', (req: Request, res: Response) => {
     res.status(200).json({
          message: "Hello developers",
          "authentication": "NextLeveldeveloper"
     });
});

app.post('/', async (req: Request, res: Response) => {
     try {
          const { name, email, age, password } = req.body;

          // Validaion (Optional kintu uttom): Kono data missing thakle jate 500 error na ase
          if (!name || !email || !password) {
               return res.status(400).json({
                    success: false,
                    message: "Name, email, and password are required!"
               });
          }

          const result = await pool.query(`
               INSERT INTO users (name, email, age, password)
               VALUES ($1, $2, $3, $4)
               RETURNING *
          `, [name, email, age, password]);

          console.log("result", result.rows[0]);

          res.status(201).json({
               success: true,
               message: "User Created successfully!",
               data: result.rows[0]
          });

     } catch (error: any) {
          res.status(500).json({
               success: false,
               message: error.message,
               error: error
          });
     }
});

app.listen(port, () => {
     console.log(`Example app listening on port ${port}`);
});