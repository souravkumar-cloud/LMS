import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { addStudent, deleteStudent, filterStudents, getAllStudents, getStudentById, getStudentsWithPagination, searchStudent, toggleStudentStatus, updateStudent } from '../controllers/studentController.js';



const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addStudent);
router.get("/pagination", authMiddleware, adminMiddleware, getStudentsWithPagination);

router.get("/filter", authMiddleware, adminMiddleware, filterStudents)

router.get("/all", authMiddleware, adminMiddleware, getAllStudents);
router.get("/search", authMiddleware, adminMiddleware, searchStudent);
router.get("/:id", authMiddleware, adminMiddleware, getStudentById);

router.put(

    "/update/:id",

    authMiddleware,

    adminMiddleware,

    updateStudent

);
router.patch("/status/:id", authMiddleware, adminMiddleware, toggleStudentStatus);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteStudent);


router.get("/filter", authMiddleware, adminMiddleware, filterStudents)

export default router;