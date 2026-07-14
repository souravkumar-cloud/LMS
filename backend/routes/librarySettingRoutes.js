import express from "express";

import {

    getLibrarySettings,

    updateLibrarySettings

} from "../controllers/librarySettingController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get(

    "/",

    authMiddleware,

    adminMiddleware,

    getLibrarySettings

);

router.put(

    "/",

    authMiddleware,

    adminMiddleware,

    updateLibrarySettings

);

export default router;