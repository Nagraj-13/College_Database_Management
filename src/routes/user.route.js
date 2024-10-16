import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getUserDetails } from "../controllers/services/academics.controllers.js";
import { processImage, uploadImage } from "../controllers/services/imageUpload.controller.js";

const router = Router();

router.route('/academics').get(protect,getUserDetails);
router.route('/upload-image').post(uploadImage, processImage);
export default router;