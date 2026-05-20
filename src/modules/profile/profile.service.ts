import { pool } from "../../db";
import type { IProfile } from "./profile.interce";

const profileDataInserIntoDB = async (payload: IProfile) => {
     const { user_id, bio, address, phone, gender } = payload;
     const user = await pool.query(
          `
    SELECT * FROM users WHERE id=$1
    `,
          [user_id],
     );
     if (user.rows.length === 0) {
          throw new Error("This user not exits");

     }
     const result = await pool.query(`

          INSERT INTO prolife (user_id, bio, address, phone, gender)
          VALUES($1,$2,$3,$4,$5) RETURNING *

          `, [user_id, bio, address, phone, gender])

     return result
}

const profileGetFromDB = async (id: string) => {

     const result = await pool.query(`
          
          SELECT * FROM prolife WHERE  user_id=$1
          `, [id])

     if (result.rows.length === 0) {
          throw new Error("This user not exits");

     }

     return result


}



export const profileService = {
     profileDataInserIntoDB,
     profileGetFromDB,
     // profileUpdateFromDB,
     // profileDeleteFromDB
}