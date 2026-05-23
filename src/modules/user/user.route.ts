import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../type";

const router: Router = Router()
router.post('/', userController.createUser);
router.get('/', auth(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user), userController.getAllUser)
router.get('/:id', userController.getSingleUser)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export const userRoute = router;   