import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from 'jsonwebtoken'
import config from "../config"
import { pool } from "../db"
import type { ROLES } from "../type"

const auth = (...role: ROLES[]) => {

     return async (req: Request, res: Response, next: NextFunction) => {


          try {

               // console.log("this part is a header portion ", );
               const token = req.headers.accesstoken
               if (!token) {
                    return res.status(401).json({
                         success: false,
                         message: "Unauthorized access!!"
                    })
               }

               const decoded = jwt.verify(token as string, config.seckey as string) as JwtPayload

               const user = await pool.query(`
               
               SELECT * FROM users WHERE email=$1  
                    `, [decoded.email])

               // console.log(user.rows);
               if (user.rows.length === 0) {
                    return res.status(404).json({
                         success: false,
                         message: "User not found!",
                    })

               }

               const userRole = user.rows[0].role

               if (role.length && !role.includes(userRole)) {
                    return res.status(403).json({
                         success: false,
                         message: "forbidden access"
                    })

               }

               if (!user.rows[0]?.is_active) {
                    return res.status(403).json({
                         success: false,
                         message: "forbidden access"
                    })
               }

               req.user = decoded;


               next()


          } catch (error) {
               next(error)

          }





     }



}


export default auth