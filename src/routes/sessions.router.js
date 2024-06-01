import { Router } from "express";
import { SECRET, generateHash } from "../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken";

export const router = Router();

router.post(
	"/registration",
	passport.authenticate("register", {
		session: false,
		failureRedirect: "/api/sessions/error",
	}),
	async (req, res) => {
		try {
			res.setHeader("Content-Type", "application/json");
			return res
				.status(201)
				.json({ payload: "Registro exitoso", newUser: req.user });
		} catch (error) {
			return res.status(400).json("Error al registrarse: ", error.message);
		}
	}
);

router.post(
	"/login",
	passport.authenticate("login", {
		session: false,
		failureRedirect: "/api/sessions/error",
	}),
	async (req, res) => {
		let { user } = req;
		//if (!user.cart) {
		// Manejar el caso donde no hay carrito
		//return res.status(400).json({ error: "User has no cart" });
		//}
		try {
			let token = jwt.sign(user, SECRET, { expiresIn: "1h" });
			console.log("Datos recibidos:", user);
			/* req.session.user = req.user; */
			res.cookie("SNScookie", token, { httpOnly: true });
			res.redirect("/home");
			/* res.setHeader("Content-Type", "application/json"); */
		} catch (error) {
			return res.status(400).json("Error al iniciar sesion: ", error.message);
		}
		/* return res.status(201).json({
			status: `succes`,
			payload: `Login exitoso`,
			user: user,
			token,
		}); */
		/* return res.redirect("/profile"); */
	}
);
router.get(`/github`, passport.authenticate("github"), (req, res) => {});
router.get(
	"/callbackGithub",
	passport.authenticate("github", {
		session: false,
		failureRedirect: "/api/sessions/error",
	}),
	(req, res) => {
		let { user } = req;

		try {
			let token = jwt.sign(user, SECRET, { expiresIn: "1h" });
			res.cookie("SNScookie", token, { httpOnly: true }); //NO SE ESTA SETEANDO LA COOKIE CON EL TOKEN
			console.log("user:", user);
			/* res.redirect("/home"); */ //NO ESTOY PUDIENDO REDIRIGIR AL HOME LUEGO DE INICIAR CON GITHUB

			res.setHeader("Content-Type", "application/json");
			return res.status(200).json({
				status: "success",
				payload: user,
				token,
			});
		} catch (error) {
			console.error("Error al generar el token:", error);
			res.status(500).json({ error: "Error interno del servidor" });
		}
	}
);
router.get("/error", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	return res
		.status(500)
		.json({ error: `Error en la operación de autenticación` });
});
router.get("/logout", (req, res) => {
	let { web } = req.query;

	/* req.session.destroy((e) => {
		if (e) {
			console.log(e);
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				error: `Error inesperado en el servidor-Intente más tarde`,
				detalle: `${error.message}`,
			});
		}
	}); */
	res.clearCookie("SNScookie");

	/* if(web){
        return res.redirect(`/login`)
    }else{
        res.setHeader('Content-Type','application/json')
        return res.status(200).json({
            status: 'success',
            payload:'Logout Exitoso...!!!'
        })    
    } */

	res.setHeader("Content-Type", "application/json");
	return res.redirect("/login");
});
