import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

export const router = Router();

const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
	let products = await productManager.getProducts();
	res.setHeader(`Content-Type`, `text/html`);
	res.status(200).render(`home`, { products });
});
/* router.get("/products", async (req, res) => {
	let products = await productManager.getProducts();

	res.setHeader(`Content-Type`, `text/html`);
	res.status(200).render(`products`, { products });
}); */

router.get("/realTimeProducts", async (req, res) => {
	let products;
	try {
		products = await productManager.getProducts();
	} catch (error) {
		console.log(error);
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor-Intente más tarde`,
		});
	}
	res.setHeader(`Content-Type`, `text/html`);
	res.status(200).render(`realTimeProducts`, { products });
});
