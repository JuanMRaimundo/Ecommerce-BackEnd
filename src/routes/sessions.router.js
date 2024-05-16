import { Router } from "express";
import { UsersManagerMongo as UsersManager } from "../dao/UsersManagerMongo.js";
import { generateHash } from "../utils.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";

export const router = Router();

const usersManager = new UsersManager();
const cartManager = new CartManager();

router.post("/registration", async (req, res) => {
	let { first_name, last_name, email, age, password } = req.body;

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
			rol: "user",
			cart: cart._id,
		});
		res.setHeader("Content-Type", "application/json");
		/* res.redirect("/login"); */
		res.status(200).json({ message: "Registro exitoso", newUser });
	} catch (error) {
		res.setHeader("Content-Type", "application/json");
		return res.status(500).json({
			error: `Error al crear nuevo usuario`,
			detalle: `${error.message}`,
		});
	}
});

router.post("/login", async (req, res) => {
	let { email, password, web } = req.body;

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
	}
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
