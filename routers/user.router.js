import express from 'express'
import { getLoggedInUser, loginUserController, logOutController, registerUserController } from '../controllers/user.controller.js'
import UserAuth from '../middleware/UserAuth.js'

const userRouter = express.Router()

userRouter.post('/register',registerUserController)
userRouter.post('/login',loginUserController)
userRouter.post('/logout',UserAuth,logOutController)
userRouter.get('/getUserDetails',UserAuth,getLoggedInUser)

export default userRouter