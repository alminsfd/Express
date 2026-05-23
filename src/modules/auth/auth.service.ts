import config from "../../config";
import { pool } from "../../db"
import type { IAuth } from "./auth.interface"
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from 'jsonwebtoken'


const loginUserIntoDB = async (payload: IAuth) => {
     const { email, password } = payload
     const users = await pool.query(`
          SELECT * FROM users WHERE email=$1
          `, [email])
     if (users.rows.length === 0) {
          throw new Error("user not exists")
     }

     const userPassword = users.rows[0].password
     // console.log(userPassword);

     const matchedPassword = await bcrypt.compare(password, userPassword);
     // console.log(matchedPassword);
     if (!matchedPassword) {

          throw new Error("Password is invalid")

     }

     const user = users.rows[0]

     const jwtpayload = {
          id: user.id,
          name: user.name,
          is_active: user.is_active,
          email: user.email,
          role: user.role
     }
     // console.log(jwtpayload);
     const accessToken = jwt.sign(jwtpayload, config.seckey as string, { expiresIn: '1d' });
     const refreshToken = jwt.sign(jwtpayload, config.refreshkey as string, { expiresIn: '30d' });
     return { accessToken, refreshToken }
}
const generateFreshToken = async (token: string) => {
     if (!token) {
          throw new Error("Unauthorized")

     }

     const decoded = jwt.verify(
          token as string,
          config.refreshkey as string,
     ) as JwtPayload;

     const users = await pool.query(`
          SELECT * FROM users WHERE email=$1
          `, [decoded.email])

     if (users.rows.length === 0) {
          throw new Error("user not exists")
     }

     const user = users.rows[0]

     if (!user?.is_active) {
          throw new Error("Forbidden!!");
     }


     const jwtpayload = {
          id: user.id,
          name: user.name,
          is_active: user.is_active,
          email: user.email,
          role: user.role
     }
     // console.log(jwtpayload);
     const accessToken = jwt.sign(jwtpayload, config.seckey as string, { expiresIn: '1d' });

     return { accessToken }
}


export const authService = {
     loginUserIntoDB,
     generateFreshToken
}