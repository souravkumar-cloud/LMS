import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { getTodayAttendance, markEntry, markExit, myAttendance, studentsInside } from '../controllers/attendanceController.js';


const router=express.Router();
router.get("/today",authMiddleware,adminMiddleware,getTodayAttendance);
// router.get("/inside",authMiddleware,adminMiddleware,studentInside);
router.get("/my-history",authMiddleware,myAttendance);
router.get("/inside",authMiddleware,adminMiddleware,studentsInside);
router.post("/entry",authMiddleware,markEntry);
router.post('/exit',authMiddleware,markExit);


export default router;