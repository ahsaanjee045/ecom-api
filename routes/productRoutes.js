import express from "express"
import { createProduct, createReview, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js";
import { adminAuth, userAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// localhost:8080/api/v1/product/
router.get("/", getAllProducts )
router.get("/:_id", getProductById )
router.post("/", adminAuth, createProduct )
router.put("/:_id", adminAuth, updateProduct )
router.put("/review/:_id", userAuth, createReview )
router.delete("/:_id", adminAuth,deleteProduct  )

export default router;