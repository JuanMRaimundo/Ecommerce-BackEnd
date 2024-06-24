import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { UsersDTO } from "../dto/UsersDTO.js";
import { sendMail } from "../utils.js";

export class UsersController {
	static registration = async (req, res) => {
		let userMail;
		try {
			userMail = req.body;
			res.setHeader("Content-Type", "application/json");
			let registroOk = await sendMail(
				userMail.email,
				"¡Registro exitoso!",
				`<h2>Bienvenido/a a SNSports!</h2><br><br>
					<p>Usuario registrado con email:${userMail.email}</p>
				`
			);
			if (registroOk.accepted.length > 0) {
				console.log("Email enviado-Usuario registrado");
			}
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
			let tokenPayload = {
				id: user._id,
				role: user.rol,
				cart: user.cart,
			};
			let token = jwt.sign(tokenPayload, config.SECRET, {
				expiresIn: "1h",
			});
			res.cookie("SNScookie", token, { httpOnly: true });
			res.redirect("/home");
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
			let userDTO = new UsersDTO(user);
			res.setHeader("Content-Type", "application/json");
			return res.status(200).json({ message: "Current user: ", user: userDTO });
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
