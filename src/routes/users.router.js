import { Router } from "express";
import { authRole, verifyRecoveryToken } from "../middleware/auth.js";
import { UsersController } from "../controllers/UsersController.js";

export const router = Router();

router.post("/premium/:uid", UsersController.switchRole);

router.post("/updatePass", verifyRecoveryToken, UsersController.updatePass);
