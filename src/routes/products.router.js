import { ProductManagerMongo as ProductManager } from "../dao/ProductManagerMongo.js";
import { Router } from "express";
import { isValidObjectId } from "mongoose";

export const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
	try {
		let products = await productManager.getProducts();
		res.setHeader("Content-Type", "application/json");
		return res.status(200).json({ products });
	} catch (error) {
		console.log(error);
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde`,
		});
	}
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
	let { pid } = req.params;
	if (!isValidObjectId(pid)) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(400).json({
			error: `Ingrese un id valido de MongoDB como argumento para su busqueda`,
		});
	}

	try {
		let product = await productManager.getProductBy({ _id: pid });
		res.setHeader("Content-Type", "application/json");
		return res.status(200).json({ product });
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
	console.log("Datos del cuerpo de la solicitud:", req.body);
	let { title, code, description, price, status, stock, category } = req.body;

	if (
		!title ||
		!code ||
		!description ||
		!price ||
		!status ||
		!stock ||
		!category
	) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res
			.status(400)
			.json({ error: `Los campos a completar son obligatorios` });
	}
	let exist;
	try {
		exist = await productManager.getProductBy({ code });
	} catch (error) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
			detail: `${error.message}`,
		});
	}
	if (exist) {
		res.setHeader("Content-Type", "application/json");
		return res.status(400).json({
			error: `El producto con código ${code} ya existe en la Base de Datos`,
		});
	}
	try {
		let newProduct = await productManager.addProduct({
			title,
			code,
			description,
			price,
			status,
			stock,
			category,
		});
		res.setHeader("Content-Type", "application/json");
		return res.status(201).json({ payload: newProduct });
	} catch (error) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
			detail: `${error.message}`,
		});
	}
});

router.put("/:pid", async (req, res) => {
	let { pid } = req.params;
	if (!isValidObjectId(pid)) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(400).json({
			error: `Ingrese un id válido de MongoDB como argumento para su busqueda`,
		});
	}
	let productEdited = req.body;
	if (productEdited._id) {
		delete productEdited._id;
	}
	if (productEdited.code) {
		let exist;
		try {
			exist = await productManager.getProductBy({
				_id: { $ne: pid },
				code: productEdited.code,
			});
			if (exist) {
				res.setHeader("Content-Type", "application/json");
				return res.status(400).json({
					error: `Ya existe otro producto en la BD con código: ${productEdited.code}`,
				});
			}
		} catch (error) {
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
				detalle: `${error.message}`,
			});
		}
	}
	try {
		let editProduct = await productManager.updateProduct(pid, productEdited);
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(200).json({ editProduct });
	} catch (error) {
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
			detalle: `${error.message}`,
		});
	}
});

router.delete("/:pid", async (req, res) => {
	let { pid } = req.params;
	if (!isValidObjectId(pid)) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(400).json({
			error: `Ingrese un id valido de MongoDB como argumento para su petición`,
		});
	}
	try {
		let result = await productManager.deleteProduct(pid);
		if (result.deletedCount > 0) {
			productManager.deleteProduct(result._id);
			res.setHeader(`Content-Type`, `aplication/json`);
			return res
				.status(200)
				.json({ payload: `Producto con id ${pid} eliminado` });
		} else {
			res.setHeader(`Content-Type`, `aplication/json`);
			return res
				.status(404)
				.json({ error: `El producto con id ${pid} no existe` });
		}
	} catch (error) {
		res.setHeader(`Content-Type`, `aplication/json`);
		return res.status(500).json({
			error: `Error inesperado en el servidor, intente más tarde`,
			detail: `${error.message}`,
		});
	}
});
