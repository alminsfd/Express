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

app.get('/', (req: Request, res: Response) => {
     res.status(200).json({

          message: "Hello developers",
          "authentication": "NextLeveldeveloper"
     })
})

app.post('/', (req: Request, res: Response) => {
     const { name, email } = req.body
     res.status(201).json({
          name: name,
          email: email
     })
})

app.listen(port, () => {
     console.log(`Example app listening on port ${port}`)
})
