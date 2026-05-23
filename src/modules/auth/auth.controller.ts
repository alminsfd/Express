import type { Request, Response } from "express";
import { authService } from "./auth.service";


const loginUser = async (req: Request, res: Response) => {
     try {
          const result = await authService.loginUserIntoDB(req.body);
          // console.log(result);
          const { email, password } = req.body
          if (!email || !password) {
               return res.status(404).json({
                    success: false,
                    message: "Password and Email must be required",
                    data: {}
               })
          }

          return res.status(200).json({
               success: true,
               message: "User login successfully!",
               data: result,
          });
     } catch (error: any) {
          return res.status(500).json({
               success: false,
               message: error.message,
               error: error,
          });
     }
};

export const authController = {
     loginUser,
};