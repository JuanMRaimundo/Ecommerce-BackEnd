import { Router } from "express";
import { UsersManagerMongo as UsersManager } from "../dao/UsersManagerMongo.js";
import { generateHash } from "../utils.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import passport from "passport";

export const router = Router();

const usersManager = new UsersManager();
const cartManager = new CartManager();

router.post(
	"/registration",
	passport.authenticate("register", { failureRedirect: "/api/sessions/error" }),
	async (req, res) => {
		res.setHeader("Content-Type", "application/json");
		return res
			.status(201)
			.json({ payload: "Registro exitoso", user: req.user });
		/* let { first_name, last_name, email, age, password } = req.body;

	if (!first_name || !last_name || !email || !age || !password) {
		res.setHeader("Content-Type", "application/json");
		return res.status(400).json({ error: `Complete los campos requeridos` });
	}
	password = generateHash(password);

	let exist = await usersManager.getUserBy({ email });
	if (exist) {
		res.setHeader("Content-Type", "application/json");
		return res.status(400).json({ error: `Ya existe el email ${email}` });
	}
	try {
		let cart = await cartManager.createCart();
		let newUser = await usersManager.createUser({
			first_name,
			last_name,
			email,
			age,
			password,
			rol,
			cart: cart._id,
		});
		res.setHeader("Content-Type", "application/json"); */
		/* res.redirect("/login"); */
		/* 	res.status(200).json({ message: "Registro exitoso", newUser });
	} catch (error) {
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error al crear nuevo usuario`,
			detalle: `${error.message}`,
		});
	} */
	}
);

router.post(
	"/login",
	passport.authenticate("login", { failureRedirect: "/api/sessions/error" }),
	async (req, res) => {
		req.session.user = req.user;
		res.setHeader("Content-Type", "application/json");
		return res.status(201).json({ payload: "Login exitoso", user: req.user });

		/* let { email, password, web } = req.body;

	if (!email || !password) {
		if (web) {
			return res.redirect(`/login?error=Complete: email y password`);
		} else {
			res.setHeader("Content-Type", "application/json");
			return res.status(400).json({ error: `Complete: email y password` });
		}
	}

	let user = await usersManager.getUserBy({
		email,
		password: generateHash(password),
	});
	if (!user) {
		if (web) {
			return res.redirect(`/login?error=Usuario o contraseña inválida`);
		} else {
			res.setHeader("Content-Type", "application/json");
			return res.status(400).json({ error: `Contraseña o email inválidos` });
		}
	}

	user = { ...user };
	delete user.password; //se borra la password para no mandarla al front
	req.session.user = user; //se inicia la session del usuario

	if (web) {
		res.redirect("/profile");
	} else {
		res.setHeader("Content-Type", "application/json");
		return res.status(200).json({ "Login correcto": user });
	} */
	}
);
router.get(`/github`, passport.authenticate("github", {}), (req, res) => {});
router.get(
	"/callbackGithub",
	passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
	(req, res) => {
		req.session.user = req.user;
		console.log(req.user);
		res.setHeader("Content-Type", "application/json");
		return res.status(201).json({ payload: "Login exitoso", user: req.user });
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
	return res.status(200).json({ payload: `Logout exitoso` });
});
