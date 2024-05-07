import { Router } from "express";
import { ProductManagerMongo as ProductManager } from "../dao/ProductManagerMongo.js";

export const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
	let { page } = req.query;
	if (!page) page = 1;
	let {
		docs: payload,
		totalPages,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
	} = await productManager.getPaginateProducts(page);

	res.setHeader(`Content-Type`, `text/html`);
	res.status(200).render(`home`, {
		payload,
		totalPages,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
	});
});

router.get("/realTimeProducts", async (req, res) => {
	let products;
	try {
		products = await productManager.getPaginateProducts(1);
		console.log(products);
		res.setHeader("Content-Type", "text/html");
		res.status(200).render("realTimeProducts", { products });
	} catch (error) {
		console.log(error);
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor-Intente más tarde`,
		});
	}
	/* res.setHeader(`Content-Type`, `text/html`);
	res.status(200).render(`realTimeProducts`, { products }); */
});

router.get("/chat", async (req, res) => {
	res.setHeader(`Content-Type`, `text/html`);
	res.status(200).render(`chat`);
});

router.get("/products", async (req, res) => {});
