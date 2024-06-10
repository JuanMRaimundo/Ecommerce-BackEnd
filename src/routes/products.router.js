import { ProductManagerMongo as ProductManager } from "../dao/ProductManagerMongo.js";
import { Router } from "express";
import { ProductsController } from "../controllers/productsController.js";

export const router = Router();

const productManager = new ProductManager();

router.get("/", ProductsController.getLimitedProducts);
router.get("/category/:category", ProductsController.getProductsByCategory);
router.get("/stock/:maxStock", ProductsController.getProductsbyStock);
router.get("/price/:sort", ProductsController.getProductsSortedbyPrice);
router.get("/title/:title", ProductsController.getProductbyTitle);
router.get("/:pid", ProductsController.getProductById);
router.post("/", ProductsController.createProduct);
router.put("/:pid", ProductsController.editProduct);
router.delete("/:pid", ProductsController.deleteProduct);
