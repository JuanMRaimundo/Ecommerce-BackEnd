import ProductManager from "../dao/ProductManager.js";
import { Router } from "express";
import { io } from "../app.js";

export const router = Router();

let productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
	let data = await productManager.getProducts();
	let limit = req.query.limit;
	if (limit && limit > 0) {
		data = data.slice(0, limit);
	}
	res.json(data);
});
router.get("/title/:title", async (req, res) => {
	let data = await productManager.getProducts();
	let title = req.params.title;
	let product = data.find(
		(t) => t.title.toLowerCase() === title.toLocaleLowerCase()
	);
	if (product) {
		res.json(product);
	} else {
		res.json({ error: `El producto ${title} no existe` });
	}
});
router.get("/:pid", async (req, res) => {
	let data = await productManager.getProducts();
	let id = req.params.pid;
	id = Number(id);
	if (isNaN(id)) {
		return res.json({ error: "Ingrese el ID numérico correspondiente" });
	}
	let product = data.find((p) => p.id === id);
	if (product) {
		res.json(product);
	} else {
		res.json({ error: "No existe ese producto" });
	}
});

router.post("/", async (req, res) => {
	console.log("Datos del cuerpo de la solicitud:", req.body);
	let {
		title,
		description,
		code,
		price,
		status,
		stock,
		category,
		thumbnails = [],
	} = req.body;
	let newProduct;

	if (
		!title ||
		!description ||
		!code ||
		!price ||
		!status ||
		!stock ||
		!category
	) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(400).json({ error: `Complete los campos requeridos` });
	}
	try {
		newProduct = await productManager.addProducts(
			title,
			description,
			code,
			price,
			status,
			stock,
			category,
			thumbnails
		);
		console.log("Nuevo producto agregado correctamente:", newProduct);
		res.setHeader(`Content-Type`, `aplication/json`);
		console.log("Nuevo producto agregado:", newProduct);
		io.emit("newProduct", newProduct);
		return res.status(201).json({ payload: "Producto agregado", newProduct });
	} catch (error) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
			detail: `${error.message}`,
		});
	}
});

router.put("/:pid", async (req, res) => {
	let id = req.params.pid;
	id = Number(id);
	if (isNaN(id)) {
		return res.json({ error: `Ingrese un id numérico` });
	}

	let productEdited = req.body;
	if (!productEdited) {
		return res.json({ error: `El producto es incorrecto` });
	}
	try {
		let editProduct = await productManager.updateProduct(id, productEdited);
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(200).json(editProduct);
	} catch (error) {
		return res.json({ error: `Error desconocido al editar producto` });
	}
});

router.delete("/:pid", async (req, res) => {
	let id = req.params.pid;
	id = Number(id);
	if (isNaN(id)) {
		res.setHeader("Content-Type", "application/json");
		return res.status(400).json({ error: `Ingrese un id numérico` });
	}

	try {
		let productDeleted = await productManager.deleteProduct(id);
		res.setHeader(`Content-Type`, `aplication/json`);
		let productsActualiced = await productManager.getProducts();
		io.emit("deletedProduct", productsActualiced);
		return res
			.status(201)
			.json({ payload: `Producto eliminado`, productDeleted });
	} catch (error) {
		return res.json({ error: `Error desconocido al eliminar producto` });
	}
});
