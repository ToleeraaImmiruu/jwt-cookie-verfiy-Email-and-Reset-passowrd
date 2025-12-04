import express from "express"
import {Register , Login, Logout  } from "../controllers/userController.js"
import { protect } from "../middlewares/authMiddleware.js";


const router =express.Router()
router.post("/register", Register)
router.post("/login", Login)
router.post("/logout", Logout)



router.get("/me", protect, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  });
});

export default router;
