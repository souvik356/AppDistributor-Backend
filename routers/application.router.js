import express from 'express'
import UserAuth from '../middleware/UserAuth.js'
import { deleteApplication, getAllApplication, getApplication, registerApplication } from '../controllers/application.controller.js'

const applicationRouter = express.Router()

applicationRouter.post('/registerApplication',UserAuth,registerApplication)
applicationRouter.get('/getApplication',UserAuth,getApplication)
applicationRouter.delete('/deleteApplication',UserAuth,deleteApplication)
applicationRouter.get('/getAllApplication',UserAuth,getAllApplication)

export default applicationRouter