import { Router } from "express";
import { userController } from "./user.controller";

const router: Router = Router()
router.post('/', userController.createUser);
router.get('/', userController.getAllUser)
router.get('/:id', userController.getSingleUser)
router.patch('/:id', userController.updateUser)

export const userRoute = router;