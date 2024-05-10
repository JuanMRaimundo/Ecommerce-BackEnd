import { ProductManagerMongo as ProductManager } from "../dao/ProductManagerMongo.js";
import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { productModel } from "../dao/models/productModel.js";

export const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
	//get a todos los productos paginados o con LIMIT
	try {
		const { limit, sort } = req.query;
		if (limit | sort) {
			const productsLimit = await productModel.find().limit(Number(limit));
			const productsSort = await productManager.getSortProducts();
			return res.status(200).json({ productsLimit, productsSort });
		} else {
			let products = await productManager.getPaginateProducts(5);
			res.setHeader("Content-Type", "application/json");
			return res.status(200).json({ products });
		}
	} catch (error) {
		console.log(error);
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde`,
		});
	}
});
router.get("/category/:category", async (req, res) => {
	let category = req.params.category;
	try {
		let payload = await productManager.getProductBy({ category: category });
		if (category) {
			res.setHeader("Content-Type", "application/json");
			return res.status(200).json({ payload: payload });
		} else {
			res.json({ error: `El producto ${title} no existe` });
		}
	} catch (error) {
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde`,
		});
	}
});
router.get("/stock/:maxStock", async (req, res) => {
	let maxStock = req.params.maxStock;
	try {
		let payload = await productManager.getProductBy({
			stock: { $lt: maxStock },
		});
		if (payload.length > 0) {
			res.setHeader("Content-Type", "application/json");
			return res.status(200).json({ payload: payload });
		} else {
			res.json({
				error: `No se encontraron productos con un stock inferior a ${maxStock}`,
			});
		}
	} catch (error) {
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor - Intente más tarde`,
		});
	}
});
router.get("/price/:sort", async (req, res) => {
	let sort = parseInt(req.params.sort);
	try {
		let payload = await productManager.getProductsSort(sort);
		res.setHeader("Content-Type", "application/json");
		return res.status(200).json({ payload: payload });
	} catch (error) {
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error inesperado en el servidor al ordenar productos por precio - Intente más tarde`,
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
	if (exist.length > 0) {
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
