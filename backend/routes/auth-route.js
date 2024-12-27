import express from "express";
import { logout,login,signup,verifyEmail,forgotpassword,resetpassword,
    checkAuth} from "../controllers/auth-controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();
router.post("/signup",signup);
router.post('/login',login);
router.post('/logout',logout);
router.post("/verify-email",verifyEmail);
router.post("/forgot-password",forgotpassword);
router.post("/reset-password/:token",resetpassword);


router.get('/check-auth',verifyToken,checkAuth)

export default router;