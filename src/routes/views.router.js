import { Router } from "express";
import { ProductManagerMongo as ProductManager } from "../dao/ProductManagerMongo.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import { auth } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { SECRET } from "../utils.js";

export const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", (req, res) => {
	res.status(200).render("login");
});

router.get(
	"/home",
	passport.authenticate("current", { session: false }),
	async (req, res) => {
		let { page } = req.query;
		/* let cartId = req.session.user?.cart._id; */
		/* const user = req.user; */
		let token = req.cookies["SNScookie"];
		let user = jwt.verify(token, SECRET);
		console.log(user);
		let cartId = user.cart._id;
		console.log(cartId);
		/* 	let cart = { _id: req.session.user.cart._id }; */
		/* console.log("ESTE ES EL CART DEL GET DE VIWES", cartId); */
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
			cartId,
		});
	}
);

router.get(
	"/realTimeProducts",
	passport.authenticate("current", { session: false }),
	async (req, res) => {
		let products;
		let token = req.cookies["SNScookie"];
		let user = jwt.verify(token, SECRET);
		let cartId = user.cart._id;
		try {
			products = await productManager.getPaginateProducts(1);

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
	}
);

router.get(
	"/chat",
	passport.authenticate("current", { session: false }),
	async (req, res) => {
		let token = req.cookies["SNScookie"];
		let user = jwt.verify(token, SECRET);
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
	}
);

router.get(
	"/carts/:cid",
	passport.authenticate("current", { session: false }),
	async (req, res) => {
		let { cid } = req.params;

		try {
			let cart = await cartManager.getCartByIdForCartView({ _id: cid });
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
	}
);

/* router.get(
	"/registration",
	(req, res) => {
		if (req.cookies["SNScookie"]?.user) {
			return res.redirect("/home");
		}
		next();
	},
	(req, res) => {
		res.status(200).render("/registration");
	}
); */
router.get("/registration", (req, res) => {
	if (req.cookies["SNScookie"]?.user) {
		return res.redirect("/home");
	}
	res.status(200).render("registration");
});

router.get("/login", (req, res) => {
	if (req.token) {
		return res.redirect("/home");
	}
	let { error } = req.query;
	res.status(200).render("login", { error });
});

router.get(
	"/profile",
	passport.authenticate("current", { session: false }),
	(req, res) => {
		let token = req.cookies["SNScookie"];
		let user = jwt.verify(token, SECRET);
		console.log(user);
		res.status(200).render("profile", { user });
	}
);
