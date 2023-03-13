import express from 'express'
import { addToCart, createCart, deleteFromCart, getCart, } from '../controllers/cartController.js';
import { adminAuth, userAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/" ,userAuth ,createCart)
router.get("/" ,userAuth ,getCart)
router.put("/addToCart" ,userAuth ,addToCart)
router.delete("/deleteFromCart/:productId" ,userAuth ,deleteFromCart)
// router.put("/update" ,userAuth ,addToCart)

export default router