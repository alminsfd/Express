import { Router } from "express";
import { userController } from "./user.controller";

const router: Router = Router()
router.post('/', userController.createUser);
router.get('/', userController.getAllUser)

export const userRoute = router;