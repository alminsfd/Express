import express, { type Application, type Request, type Response } from "express"
import { userRoute } from "./modules/user/user.route"
import { profileRouter } from "./modules/profile/profile.route"
import { authRoute } from "./modules/auth/auth.route"
import fs from 'fs'
import logger from "./logger"

const app: Application = express()
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req: Request, res: Response) => {
     res.status(200).json({
          message: "Hello developers",
          "authentication": "NextLeveldeveloper"
     });
});

app.use(logger)

// users endponts
app.use('/api/users', userRoute)
//profile endpoinsts
app.use('/api/profile', profileRouter)
//auth endpoints
app.use("/api/auth", authRoute);

export default app