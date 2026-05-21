import { Router } from "express";
import { profileController } from "./profile.controller";

const router = Router()
router.post('/', profileController.createProfile)
router.get('/:id', profileController.getProfile)
router.patch('/:id', profileController.updateProfile)
router.delete('/:id', profileController.deleteProfile)


export const profileRouter = router;