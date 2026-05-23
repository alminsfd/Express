import express, { type Application, type Request, type Response } from "express"
import { userRoute } from "./modules/user/user.route"
import { profileRouter } from "./modules/profile/profile.route"
import { authRoute } from "./modules/auth/auth.route"
import logger from "./middleware/logger"
import CookieParser from 'cookie-parser'
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler"



const app: Application = express()
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))
app.use(CookieParser())
app.get('/', (req: Request, res: Response) => {
     res.status(200).json({
          message: "Hello developers",
          "authentication": "NextLeveldeveloper"
     });
});

app.use(
     cors({
          origin: "http://localhost:5000"
     })

)

app.use(logger)

// users endponts
app.use('/api/users', userRoute)
//profile endpoinsts
app.use('/api/profile', profileRouter)
//auth endpoints
app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app