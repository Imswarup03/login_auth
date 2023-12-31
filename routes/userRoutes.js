import express from 'express';
const router = express.Router();

import UserController from '../controller/userController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';



// Route Level Middleware
router.use('/change-password',checkUserAuth)
router.use('/logged-user',checkUserAuth)
router.use('/delete-user',checkUserAuth)
router.use('/logout',checkUserAuth)

//Public Routes
router.post('/register',UserController.userRegistration);
router.post('/login',UserController.userLogin)
router.post('/forgot-password',UserController.sendUserResetEmail)
router.post('/resetpassword/:id/:token',UserController.resetUserPassword)




//Protected Routes
router.put('/change-password',UserController.changeUserPassword)
router.get('/logged-user',UserController.loggedUser)
router.delete('/delete-user',UserController.deleteUser)
router.post('/logout',UserController.logoutUser)




export default router