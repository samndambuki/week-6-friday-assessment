import { Router } from "express";
import { registerUser, resetPassword, searchUsersByName } from "../controllers/usersContoller";

const userRoutes = Router()


userRoutes.post('/',registerUser)
userRoutes.post('/reset-password', resetPassword);
userRoutes.get('/search', searchUsersByName);

export default userRoutes