import express from 'express';
import {login, createStudent,changePassword, createAdmin} from '../controllers/authController.js'

import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router=express.Router();

// router.post("/register",register)
router.post("/login",login)
// router.post("/create-student",authMiddleware,adminMiddleware,createStudent)
router.put("/change-password",authMiddleware,changePassword)
router.post("/create-admin", createAdmin);


export default router