import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/serverResponse";


const loginUser = async (req: Request, res: Response) => {
     try {
          // console.log(result);
          const { email, password } = req.body
          if (!email || !password) {
               return res.status(404).json({
                    success: false,
                    message: "Password and Email must be required",
                    data: {}
               })
          }

          const result = await authService.loginUserIntoDB(req.body);
          const { refreshToken } = result

          res.cookie("refreshToken", refreshToken, {
               secure: false,
               httpOnly: true,
               sameSite: "lax"
          })

               ;
     } catch (error: any) {
          sendResponse(res,
               {
                    statusCode: 500,
                    success: false,
                    message: error.message,
                    error: error,
               }

          );
     }
};
const refreshToken = async (req: Request, res: Response) => {
     try {

          // console.log();
          const result = await authService.generateFreshToken(req.cookies.refreshToken);
          sendResponse(res,
               {
                    statusCode: 200,
                    success: true,
                    message: "Users fetched successfully!",
                    data: result
               })
     } catch (error: any) {
          sendResponse(res,
               {
                    statusCode: 500,
                    success: false,
                    message: error.message,
                    error: error,
               }

          );
     }
};

export const authController = {
     loginUser,
     refreshToken
};