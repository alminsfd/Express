import express, { type Application, type Request, type Response } from "express"
import { pool } from "./db"
const app: Application = express()
app.use(express.json())
// app.use(express.text())
// app.use(express.urlencoded({ extended: true }))



app.get('/', (req: Request, res: Response) => {
     res.status(200).json({
          message: "Hello developers",
          "authentication": "NextLeveldeveloper"
     });
});

//create users 

app.post('/api/users', async (req: Request, res: Response) => {
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

//get all apis 

app.get('/api/users', async (req: Request, res: Response) => {
     try {
          const result = await pool.query(`
          SELECT * FROM users 
          `)
          if (result.rows.length === 0) {

               res.status(404).json({
                    success: false,
                    message: "User Not found!",
                    data: {},
               });

          }
          res.status(200).json({
               success: true,
               message: 'successfully data retrive',
               data: result.rows[0]
          })
     } catch (error: any) {
          res.status(500).json({
               success: false,
               message: error.message,
               error: error
          })


     }
})

// get singles apis
app.get('/api/users/:id', async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          const result = await pool.query(`
          SELECT * FROM users  WHERE id=$1
          `, [id])
          if (result.rows.length === 0) {

               res.status(404).json({
                    success: false,
                    message: "User Not found!",
                    data: {},
               });

          }
          res.status(200).json({
               success: true,
               message: 'successfully data retrive',
               data: result.rows[0]
          })
     } catch (error: any) {
          res.status(500).json({
               success: false,
               message: error.message,
               error: error
          })


     }
})

// update data

app.patch('/api/users/:id', async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          const { name, is_active, age, password } = req.body
          const result = await pool.query(`
          UPDATE users SET name=COALESCE($1,name), is_active=COALESCE($2,is_active), age=COALESCE($3,age), password=COALESCE($4,password) WHERE id=$5 RETURNING *
          `, [name, is_active, age, password, id])
          if (result.rows.length === 0) {

               res.status(404).json({
                    success: false,
                    message: "User Not found!",
                    data: {},
               });

          }
          res.status(200).json({
               success: true,
               message: 'successfully data retrive',
               data: result.rows[0]
          })
     } catch (error: any) {
          res.status(500).json({
               success: false,
               message: error.message,
               error: error
          })


     }
})

//delete

app.delete('/api/users/:id', async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          const result = await pool.query(`
          DELETE FROM users  WHERE id=$1 
          `, [id])
          if (result.rowCount === 0) {
               res.status(404).json({
                    success: false,
                    message: 'user not founds',

               })
          }
          res.status(200).json({
               success: true,
               message: 'successfully data deleted',
               data: result.rows[0]
          })
     } catch (error: any) {
          res.status(500).json({
               success: false,
               message: error.message,
               error: error
          })


     }
})

export default app