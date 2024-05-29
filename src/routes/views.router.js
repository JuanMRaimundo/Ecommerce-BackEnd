import { Router } from "express";
import { ProductManagerMongo as ProductManager } from "../dao/ProductManagerMongo.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import { auth } from "../middleware/auth.js";

import passport from "passport";

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
		const user = req.user;
		console.log(user);
		const cartId = user.cart._id;
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
			login: req.session.user,
		});
	}
);

router.get(
	"/realTimeProducts",
	passport.authenticate("current", { session: false }),
	auth(["user"]),
	async (req, res) => {
		let products;
		try {
			products = await productManager.getPaginateProducts(1);
			console.log(products);
			res.setHeader("Content-Type", "text/html");
			res
				.status(200)
				.render("realTimeProducts", { products, login: req.session.user });
		} catch (error) {
			console.log(error);
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				error: `Error inesperado en el servidor-Intente más tarde`,
			});
		}
	}
);

router.get("/chat", async (req, res) => {
	res.setHeader(`Content-Type`, `text/html`);
	res.status(200).render(`chat`);
});

router.get("/carts/:cid", async (req, res) => {
	let { cid } = req.params;
	let cart = await cartManager.getCartByIdForCartView({ _id: cid });

	console.log(cart);
	res.setHeader("Content-Type", "text/html");
	return res.status(200).render("carts", { cart, login: req.session.user });
});

router.get("/registration", (req, res) => {
	res.status(200).render("registration");
});

router.get("/login", (req, res) => {
	if (req.token) {
		return res.redirect("/home");
	}
	let { error } = req.query;
	res.status(200).render("login", { error });
});

router.get("/profile", (req, res) => {
	console.log(req.user);
	res.status(200).render("profile", { login: req.user });
});
