import jwt from "jsonwebtoken";
import { CartsMongoDAO as CartsDAO } from "../dao/CartsMongoDAO.js";
import { ProductsMongoDAO as ProductsDAO } from "../dao/ProductsMongoDAO.js";
import { config } from "../config/config.js";

const cartsDao = new CartsDAO();
const productsDao = new ProductsDAO();

export class ViewsController {
	static homeView = async (req, res) => {
		let { page } = req.query;
		let token = req.cookies["SNScookie"];
		let user = jwt.verify(token, config.SECRET);
		console.log(user);
		let cartId = user.cart._id;
		console.log(cartId);
		if (!page) page = 1;
		let {
			docs: payload,
			totalPages,
			hasPrevPage,
			hasNextPage,
			prevPage,
			nextPage,
		} = await productsDao.getPaginateProducts(page);
		res.setHeader(`Content-Type`, `text/html`);
		res.status(200).render(`home`, {
			payload,
			totalPages,
			hasPrevPage,
			hasNextPage,
			prevPage,
			nextPage,
			cartId,
		});
	};
	static realTimeProductsView = async (req, res) => {
		let products;
		let token = req.cookies["SNScookie"];
		let user = jwt.verify(token, config.SECRET);
		let cartId = user.cart._id;
		try {
			products = await productsDao.getPaginateProducts(1);

			res.setHeader("Content-Type", "text/html");
			res
				.status(200)
				.render("realTimeProducts", { products, user: user, cartId });
		} catch (error) {
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				error: `Error inesperado en el servidor-Intente más tarde`,
			});
		}
	};
	static chatView = async (req, res) => {
		let token = req.cookies["SNScookie"];
		let user = jwt.verify(token, config.SECRET);
		let cartId = user.cart._id;
		try {
			res.setHeader("Content-Type", "text/html");
			res.status(200).render("chat", { user: user, cartId });
		} catch (error) {
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				status: "error",
				error:
					"Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
				detalle: `${error.message}`,
			});
		}
	};
	static cartView = async (req, res) => {
		let { cid } = req.params;

		try {
			let cart = await cartsDao.getCartByIdForCartView({ _id: cid });
			res.setHeader("Content-Type", "text/html");
			return res
				.status(200)
				.render("carts", { cart, user: req.cookies["SNScookie"]?.user });
		} catch (error) {
			console.error(error);
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				status: "error",
				error:
					"Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
				detalle: `${error.message}`,
			});
		}
	};
	static profileView = async (req, res) => {
		try {
			let token = req.cookies["SNScookie"];
			let user = jwt.verify(token, config.SECRET);
			console.log(user);
			res.status(200).render("profile", { user });
		} catch (error) {
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				status: "error",
				error:
					"Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
				detalle: `${error.message}`,
			});
		}
	};
	static registrationView = async (req, res) => {
		try {
			if (req.cookies["SNScookie"]?.user) {
				return res.redirect("/home");
			}
			res.status(200).render("registration");
		} catch (error) {
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				status: "error",
				error:
					"Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
				detalle: `${error.message}`,
			});
		}
	};
	static loginView = async (req, res) => {
		try {
			if (req.token) {
				return res.redirect("/home");
			}
			let { error } = req.query;
			res.status(200).render("login", { error });
		} catch (error) {
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				status: "error",
				error:
					"Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
				detalle: `${error.message}`,
			});
		}
	};
}
