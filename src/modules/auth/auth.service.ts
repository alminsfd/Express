import config from "../../config";
import { pool } from "../../db"
import type { IAuth } from "./auth.interface"
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'


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
     }
     // console.log(jwtpayload);
     const accessToken = jwt.sign(jwtpayload, config.seckey as string, { expiresIn: '1d' });
     return { accessToken }
}


export const authService = {
     loginUserIntoDB
}