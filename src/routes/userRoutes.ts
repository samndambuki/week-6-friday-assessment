import { Router } from "express";
import { registerUser, resetPassword } from "../controllers/usersContoller";

const userRoutes = Router()


userRoutes.post('/',registerUser)
userRoutes.post('/reset-password', resetPassword);
userRoutes.get('/user',)
userRoutes.get('/:id',)
userRoutes.put('/:id',)
userRoutes.delete('/:id',)

export default userRoutes