import CartManager from "../dao/CartManager.js";
import { Router } from "express";

export const router = Router();

let cartManager = new CartManager("./src/data/cart.json");

/* router.get(`/`, (req, res) => {
	let carts = cartManager.getCarts();
	res.setHeader(`Content-Type`, `aplication/json`);
	res.status(200).json(carts);
}); */

router.get(`/`, async (req, res) => {
	let data = await cartManager.getCarts();
	let limit = req.query.limit;
	if (limit && limit > 0) {
		data = data.slice(0, limit);
	}
	res.json(data);
});

router.get(`/:cid`, async (req, res) => {
	let data = await cartManager.getCarts();
	let id = req.params.cid;
	id = Number(id);
	if (isNaN(id)) {
		return res.json({ error: `Error, ingrese un ID numérico` });
	}
	let cart = data.find((c) => c.id === id);
	if (cart) {
		res.json(cart);
	} else {
		res.json({ error: `No existe el cart con el id: ${id}` });
	}
});
router.post("/", async (req, res) => {
	const c = cartManager;
	const result = await c.createCart();
	return res.json({ result });
});

router.post("/:cid/product/:pid", async (req, res) => {
	const { cid, pid } = req.params;
	const c = cartManager;
	const result = await c.addToCart(Number(cid), Number(pid));
	return res.json({ result });
});
router.put("/:id", async (req, res) => {});
router.delete("/:cid/product/:pid", async (req, res) => {
	const { cid, pid } = req.params;
	const c = cartManager;
});
