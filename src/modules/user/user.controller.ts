import type { Request, Response } from "express";
import { userService } from "./user.service";





const createUser = async (req: Request, res: Response) => {

     try {


          const { name, email, password } = req.body;
          if (!name || !email || !password) {
               return res.status(400).json({
                    success: false,
                    message: "Name, email, and password are required!"
               });
          }

          const result = await userService.insetDataIntoDB(req.body)

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
}

export const userController = {

     createUser

}