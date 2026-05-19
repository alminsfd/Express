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

const getSingleUserFromDB = async (id: string) => {
     const result = await pool.query(`
          SELECT * FROM users  WHERE id=$1
          `, [id])

     return result
}

const updateUserFromDB = async (id: string, payload: IUser) => {
     const { name, is_active, age, password } = payload
     const result = await pool.query(`
          UPDATE users SET name=COALESCE($1,name), is_active=COALESCE($2,is_active), age=COALESCE($3,age), password=COALESCE($4,password) WHERE id=$5 RETURNING *
          `, [name, is_active, age, password, id])

     return result
}

const deleteUserFormDB = async (id: string) => {
     const result = await pool.query(`
          DELETE FROM users  WHERE id=$1 
          `, [id])
     return result
}

export const userService = {
     insetUserIntoDB,
     getAlluserFromDB,
     getSingleUserFromDB,
     updateUserFromDB,
     deleteUserFormDB
}