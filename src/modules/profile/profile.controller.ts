import type { Request, Response } from "express";
import { profileService } from "./profile.service";
import sendResponse from "../../utility/serverResponse";

const createProfile = async (req: Request, res: Response) => {

     try {
          const result = await profileService.profileDataInserIntoDB(req.body)
          console.log(result);
          return res.status(201).json({
               success: true,
               message: "Profile created successfully!",
               data: result.rows[0],
          })
     } catch (error: any) {
          return res.status(500).json({
               succes: false,
               message: error.message,
               error: error

          })
     }

}
const getProfile = async (req: Request, res: Response) => {

     try {
          const { id } = req.params
          const result = await profileService.profileGetFromDB(id as string)
          // console.log(result);
          sendResponse(res,
               {
                    statusCode: 200,
                    success: true,
                    message: "Users fetched successfully!",
                    data: result.rows[0],
               })
     } catch (error: any) {
          sendResponse(res,
               {
                    statusCode: 500,
                    success: false,
                    message: error.message,
                    error: error,
               }

          )
     }

}
const updateProfile = async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          if (!id) {
               return res.status(404).json({
                    success: false,
                    message: "ID must be required",
                    data: {}
               })
          }
          const result = await profileService.profileUpdateFromDB(id as string, req.body)
          // console.log(result);
          return res.status(201).json({
               success: true,
               message: "Profile update successfully!",
               data: result.rows[0],
          })
     } catch (error: any) {
          return res.status(500).json({
               succes: false,
               message: error.message,
               error: error

          })
     }

}
const deleteProfile = async (req: Request, res: Response) => {

     const { id } = req.params

     if (!id) {
          return res.status(404).json({
               success: false,
               message: "ID must be required",
               data: {}
          })
     }

     try {
          const result = await profileService.profileDeleteFromDB(id as string)
          // console.log(result);
          return res.status(201).json({
               success: true,
               message: "Profile delete successfully!",
               data: result.rows[0],
          })
     } catch (error: any) {
          return res.status(500).json({
               succes: false,
               message: error.message,
               error: error

          })
     }

}

export const profileController = {
     createProfile,
     getProfile,
     updateProfile,
     deleteProfile,
}