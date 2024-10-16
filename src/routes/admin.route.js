import { Router } from "express";
import { addScheme } from "../controllers/admin/addScheme.controller.js";
import { updateScheme } from "../controllers/admin/updateSchema.controller.js";

const router = Router();

router.route('/addScheme').post(addScheme);
router.route('/updateScheme').patch(updateScheme);

export default router;