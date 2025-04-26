import express from "express";
import { registerUser, loginUser, logoutUser, loginGoogle, storeUserSession } from "../controllers/authController.js";
import { isAuthenticated } from "../authMiddleware/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get(
    "/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

router.get(
  "/google/secrets",
  passport.authenticate("google", { failureRedirect: "http://localhost:5174/login" }),loginGoogle);

router.get("/user", isAuthenticated, storeUserSession);

  
export default router;




