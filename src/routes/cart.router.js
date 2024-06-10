import { Router } from "express";
import { CartsController } from "../controllers/CartsController.js";

export const router = Router();

router.get(`/`, CartsController.getCarts);
router.get(`/:cid`, CartsController.getCartById);
router.post("/", CartsController.createCart);
router.post("/:cid/products/:pid", CartsController.addProductToCart);
router.put("/:cid", CartsController.editCart);
router.put("/:cid/products/:pid", CartsController.editQuantityCart);
router.delete("/:cid", CartsController.deleteEveryProducts);
router.delete("/:cid/products/:pid", CartsController.deleteAProductOfCart);
