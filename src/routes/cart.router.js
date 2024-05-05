import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { cartsModel } from "../dao/models/cartModel.js";

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
		let cart = await cartManager.getCartById({ _id: cid });
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

router.post("/:cid/products/:pid", async (req, res) => {
	let { cid, pid } = req.params;
	if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
		return res.status(400).json({
			error: `Ingrese un id valido de MongoDB como argumento para su petición`,
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
router.put("/:cid", async (req, res) => {
	//PARA ACTUALIZAR UN CARRITO
	let { cid } = req.params;
	let { pid, quantity } = req.body;
	console.log("este es el cid" + cid);
	console.log("este es el Pid" + pid);
	console.log("este es el quiantity" + quantity);

	if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
		return res.status(400).json({
			error: `Ingrese un id válido de MongoDB como argumento para su petición`,
		});
	}
	if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
		return res.status(400).json({
			error: `Ingrese una cantidad válida para actualizar el producto en el carrito`,
		});
	}
	try {
		await cartManager.upDateCart(cid, pid, parseInt(quantity));
		let updatedCart = await cartManager.getCartById(cid);
		console.log("el carrito actualizado:" + updatedCart);
		res.json({ payload: updatedCart });
	} catch (error) {
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor al actualizar el carrito - Intente más tarde`,
			detalle: `${error.message}`,
		});
	}
});
router.put("/:cid/products/:pid", async (req, res) => {
	//EDITAR QUANTITY DE PRODUCTOS
	let { cid, pid } = req.params;
	let { quantity } = req.body;
	console.log("este es el cid" + cid);
	console.log("este es el Pid" + pid);
	console.log("este es el quiantity" + quantity);

	if (!isValidObjectId(cid)) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(400).json({
			error: `Ingrese un id valido de MongoDB como argumento para su petición`,
		});
	}
	if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
		return res.status(400).json({
			error: `Ingrese una cantidad válida para actualizar la cantidad del producto en el carrito`,
		});
	}
	try {
		let updatedProduct = await cartManager.upDateQuantityCart(
			cid,
			pid,
			quantity
		);
		console.log(updatedProduct);
		res.json({
			message: "Cantidad actualizada correctamente",
			cart: updatedProduct,
		});
	} catch (error) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(500).json({
			error: `Error inesperado en el servidor, intente más tarde`,
			detail: `${error.message}`,
		});
	}
});

router.delete("/:cid", async (req, res) => {
	let { cid } = req.params;
	if (!isValidObjectId(cid)) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(400).json({
			error: `Ingrese un id valido de MongoDB como argumento para su petición`,
		});
	}
	try {
		let deleteProductsCart = await cartManager.deleteEveryProducts(cid);
		res.json({
			message: "Productos eliminados del carrito",
			cart: deleteProductsCart,
		});
	} catch (error) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(500).json({
			error: `Error inesperado en el servidor, intente más tarde`,
			detail: `${error.message}`,
		});
	}
});

router.delete("/:cid/products/:pid", async (req, res) => {
	let { cid, pid } = req.params;
	if (!isValidObjectId(cid)) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(400).json({
			error: `Ingrese un id valido de MongoDB como argumento para su petición`,
		});
	}
	try {
		let updatedCart = await cartManager.deleteProduct(cid, pid);
		res.json({ message: "Producto eliminado del carrito", cart: updatedCart });
	} catch (error) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(500).json({
			error: `Error inesperado en el servidor, intente más tarde`,
			detail: `${error.message}`,
		});
	}
});
