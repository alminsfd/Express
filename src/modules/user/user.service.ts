import { pool } from "../../db";
import type { IUser } from "./user.interface";


const insetUserIntoDB = async (payload: IUser) => {
     const { name, email, age, password } = payload
     const result = await pool.query(`
               INSERT INTO users (name, email, age, password)
               VALUES ($1, $2, $3, $4)
               RETURNING *
          `, [name, email, age, password]);
     return result

}

const getAlluserFromDB = async () => {
     const result = await pool.query(`
          SELECT * FROM users 
          `)
     return result
}

export const userService = {
     insetUserIntoDB,
     getAlluserFromDB,
}