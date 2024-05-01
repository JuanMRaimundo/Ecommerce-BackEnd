import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import { Router } from "express";
import { isValidObjectId } from "mongoose";

export const router = Router();

const cartManager = new CartManager();

router.get(`/`, async (req, res) => {
	try {
		let carts = await cartManager.getCarts();
		res.setHeader("Content-Type", "application/json");
		return res.status(200).json({ carts });
	} catch (error) {
		console.log(error);
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde`,
		});
	}
});

router.get(`/:cid`, async (req, res) => {
	let { cid } = req.params;

	if (!isValidObjectId(cid)) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(400).json({
			error: `Ingrese un id valido de MongoDB como argumento para su busqueda`,
		});
	}
	try {
		let cart = await cartManager.getCartBy({ _id: cid });
		res.setHeader("Content-Type", "application/json");
		return res.status(200).json({ cart });
	} catch (error) {
		console.log(error);
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
			detalle: `${error.message}`,
		});
	}
});
router.post("/", async (req, res) => {
	const newCart = await cartManager.createCart();
	return res.json({ payload: newCart });
});

router.post("/:cid/product/:pid", async (req, res) => {
	let { cid, pid } = req.params;
	if (!isValidObjectId(cid, pid)) {
		return res.status(400).json({
			error: `Enter a valid MongoDB id`,
		});
	}
	try {
		await cartManager.addToCart(cid, pid);
		let cartUpdated = await cartManager.getCartById(cid);
		res.json({ payload: cartUpdated });
	} catch (error) {
		res.setHeader("Content-Type", "application/json");
		return res.status(300).json({
			error: `Error al agregar productos al carrito`,
			detalle: `${error.message}`,
		});
	}
});
router.put("/:id", async (req, res) => {});

router.delete("/:cid/product/:pid", async (req, res) => {
	const { cid, pid } = req.params;
	const c = cartManager;
});
