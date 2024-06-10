import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export class UsersController {
	static registration = async (req, res) => {
		try {
			res.setHeader("Content-Type", "application/json");
			return res
				.status(201)
				.json({ payload: "Registro exitoso", newUser: req.user });
		} catch (error) {
			return res.status(400).json("Error al registrarse: ", error.message);
		}
	};
	static login = async (req, res) => {
		let { user } = req;

		try {
			let token = jwt.sign(user, config.SECRET, { expiresIn: "1h" });
			console.log("Datos recibidos:", user);
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
	};
	static callBackGitHub = async (req, res) => {
		try {
			let { user } = req;
			let token = jwt.sign(user, config.SECRET, { expiresIn: "1h" });
			res.cookie("SNScookie", token, { httpOnly: true }); //NO SE ESTA SETEANDO LA COOKIE CON EL TOKEN
			console.log("user:", user);
			/* res.redirect("/home"); */ //NO ESTOY PUDIENDO REDIRIGIR AL HOME LUEGO DE INICIAR CON GITHUB

			res.setHeader("Content-Type", "application/json");
			return res.status(200).json({
				status: "success",
				payload: "Login exitoso.",
				user: user,
			});
		} catch (error) {
			console.error("Error al generar el token:", error);
			res.status(500).json({ error: "Error interno del servidor" });
		}
	};
	static current = async (req, res) => {
		try {
			if (!req.user) {
				return res.status(401).json({ message: "User no autenticado" });
			}
			let { user } = req;
			const token = req.cookies["SNScookie"];
			if (!token) {
				return res.status(400).json({ message: "Token not found" });
			}
			res.cookie("SNScookie", token, { httpOnly: true });
			console.log("user:", user);
			res.setHeader("Content-Type", "application/json");
			return res.status(200).json({ message: "Current user: ", user: user });
		} catch (error) {
			return res.status(400).json({
				message: "Error al mostrar el current user: ",
				error: error.message,
			});
		}
	};
	static errorRoute = (req, res) => {
		res.setHeader("Content-Type", "application/json");
		return res
			.status(500)
			.json({ error: `Error en la operación de autenticación` });
	};
	static logout = (req, res) => {
		res.clearCookie("SNScookie");
		res.setHeader("Content-Type", "application/json");
		return res.redirect("/login");
	};
}
