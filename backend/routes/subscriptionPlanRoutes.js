import express from "express";

import {
    createPlan,
    getPlans,
    updatePlan,
    deletePlan
} from '../controllers/subscriptionPlanController.js';
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";


const router=express.Router();

router.post("/create",authMiddleware,adminMiddleware,createPlan);
router.get("/all",authMiddleware,adminMiddleware,getPlans);
router.put("/update/:id",authMiddleware,adminMiddleware,updatePlan);
router.delete("/delete/:id",authMiddleware,adminMiddleware,deletePlan);

export default router;