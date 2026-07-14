import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { addStudent, filterStudents, getAllStudents, getStudentById, getStudentsWithPagination, searchStudent, toggleStudentStatus, updateStudent } from '../controllers/studentController.js';
import upload from "../middlewares/uploadMiddleware.js";



const router=express.Router();

router.post("/add",authMiddleware,adminMiddleware,upload.single("profilePhoto"),addStudent);
router.get("/pagination",authMiddleware,adminMiddleware,getStudentsWithPagination);

router.get("/filter",authMiddleware,adminMiddleware,filterStudents)

router.get("/all",authMiddleware,adminMiddleware,getAllStudents);
router.get("/search",authMiddleware,adminMiddleware,searchStudent);
router.get("/:id",authMiddleware,adminMiddleware,getStudentById);
// router.put("/update/:id",authMiddleware,adminMiddleware,updateStudent);

router.put(

    "/update/:id",

    authMiddleware,

    adminMiddleware,

    upload.single("profilePhoto"),

    updateStudent

);
router.patch("/status/:id",authMiddleware,adminMiddleware,toggleStudentStatus);


router.get("/filter",authMiddleware,adminMiddleware,filterStudents)

export default router;