import { Router } from "express";
import { registerUser } from "../controllers/usersContoller";

const userRoutes = Router()


userRoutes.post('/',registerUser)
userRoutes.get('/product',)
userRoutes.get('/:id',)
userRoutes.put('/:id',)
userRoutes.delete('/:id',)

export default userRoutes