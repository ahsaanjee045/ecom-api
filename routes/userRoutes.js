import express from 'express'
import { deleteUser, getAllUser, loginUser, registerUser, updateAdmin } from '../controllers/userController.js';
import { adminAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", adminAuth, getAllUser)
router.put("/:_id", adminAuth, updateAdmin)
router.delete("/:_id", adminAuth, deleteUser)
router.post("/register", registerUser)
router.post("/login", loginUser)

export default router;