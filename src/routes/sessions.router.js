import { Router } from "express";
import { UsersManagerMongo as UsersManager } from "../dao/UsersManagerMongo.js";
import { SECRET, generateHash } from "../utils.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import passport from "passport";
import { auth } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

export const router = Router();

const usersManager = new UsersManager();
const cartManager = new CartManager();

router.post(
	"/registration",
	/* passport.authenticate("register", { failureRedirect: "/api/sessions/error" }), */
	async (req, res) => {
		res.setHeader("Content-Type", "application/json");
		return res
			.status(201)
			.json({ payload: "Registro exitoso", newUser: req.user });
	}
);

router.post(
	"/login",
	passport.authenticate("login", {
		session: false,
		failureRedirect: "/api/sessions/error",
	}),
	async (req, res) => {
		let user = req.body;
		//if (!user.cart) {
		// Manejar el caso donde no hay carrito
		//return res.status(400).json({ error: "User has no cart" });
		//}
		user = { ...user };
		delete user.password;
		let token = jwt.sign(user, SECRET, { expiresIn: "1h" });
		console.log("Datos recibidos:", user);
		/* req.session.user = req.user; */
		res.cookie("SNScookie", token, { httpOnly: true });
		res.setHeader("Content-Type", "application/json");
		return res.status(201).json({ payload: user, token });
		/* return res.redirect("/profile"); */
	}
);
router.get(`/github`, passport.authenticate("github", {}), (req, res) => {});
router.get(
	"/callbackGithub",
	passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
	(req, res) => {
		let user = req.user;

		let token = jwt.sign(user, SECRET, { expiresIn: "1h" });
		/* req.session.user = req.user; */
		console.log(req.user);
		res.setHeader("Content-Type", "application/json");
		/* res.status(201).json({ payload: "Login exitoso", user: req.user }); */
		return res.redirect("/profile");
	}
);
router.get("/error", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	return res
		.status(500)
		.json({ error: `Error en la operación de autenticación` });
});
router.get("/logout", (req, res) => {
	req.session.destroy((e) => {
		if (e) {
			console.log(e);
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				error: `Error inesperado en el servidor-Intente más tarde`,
				detalle: `${error.message}`,
			});
		}
	});
	res.setHeader("Content-Type", "application/json");
	return res.redirect("/login");
});
