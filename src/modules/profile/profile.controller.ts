import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {

     try {
          const result = await profileService.profileDataInserIntoDB(req.body)
          console.log(result);
          res.status(201).json({
               success: true,
               message: "Profile created successfully!",
               data: result.rows[0],
          })
     } catch (error: any) {
          res.status(500).json({
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
          res.status(201).json({
               success: true,
               message: "Profile retrive successfully!",
               data: result.rows[0],
          })
     } catch (error: any) {
          res.status(500).json({
               succes: false,
               message: error.message,
               error: error

          })
     }

}
// const updateProfile = async (req: Request, res: Response) => {

//      try {
//           const result = await profileService.profileUpdateFromDB(req.body)
//           console.log(result);
//           res.status(201).json({
//                success: true,
//                message: "Profile update successfully!",
//                data: result.rows[0],
//           })
//      } catch (error: any) {
//           res.status(500).json({
//                succes: false,
//                message: error.message,
//                error: error

//           })
//      }

// }
// const deleteProfile = async (req: Request, res: Response) => {

//      try {
//           const result = await profileService.profileDeleteFromDB(req.body)
//           console.log(result);
//           res.status(201).json({
//                success: true,
//                message: "Profile delete successfully!",
//                data: result.rows[0],
//           })
//      } catch (error: any) {
//           res.status(500).json({
//                succes: false,
//                message: error.message,
//                error: error

//           })
//      }

// }

export const profileController = {
     createProfile,
     getProfile,
     // updateProfile,
     // deleteProfile,
}