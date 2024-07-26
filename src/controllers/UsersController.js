import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import { UsersDTO } from "../dto/UsersDTO.js";
import { sendMail } from "../utils.js";
import { usersService } from "../repository/users.service.js";
import { isValidObjectId } from "mongoose";

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
				req.logger.info("Email enviado-Usuario registrado");
			}
			return res
				.status(201)
				.json({ payload: "Registro exitoso", newUser: req.user });
		} catch (error) {
			req.logger.error("Error durante el registro" + "error:" + error.stack);
			return res.status(400).json("Error al registrarse: ", error.message);
		}
	};
	static login = async (req, res) => {
		let { user } = req;

		try {
			let token = jwt.sign(user, config.SECRET, { expiresIn: "1h" });
			req.logger.info("Datos recibidos:", user);
			res.cookie("SNScookie", token, { httpOnly: true });
			res.redirect("/home");
		} catch (error) {
			req.logger.error("Error al iniciar sesion");
			return res.status(400).json("Error al iniciar sesion: ", error.message);
		}
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
			req.logger.error("Error al generar el token:", error);
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
		req.logger.error("Error de la operación de autenticación");
		return res
			.status(500)
			.json({ error: `Error en la operación de autenticación` });
	};
	static logout = (req, res) => {
		res.clearCookie("SNScookie");
		res.setHeader("Content-Type", "application/json");
		return res.redirect("/login");
	};

	static updatePass = async (req, res) => {
		const { newPass } = req.body;
		const token = req.cookies.recoveryToken;

		if (!token) {
			return res
				.status(400)
				.json({ error: "Token de recuperación no encontrado" });
		}

		try {
			const decoded = jwt.verify(token, config.SECRET);
			const userId = decoded.id;
			const user = await usersService.getUserBy({ _id: userId });
			if (!user) {
				return res.status(404).json({ error: "Usuario no encontrado en BD" });
			}
			const isSamePassword = await bcrypt.compare(newPass, user.password);
			if (isSamePassword) {
				return res.status(400).json({
					error:
						"La nueva contraseña no puede ser igual a la contraseña actual",
				});
			}
			const hashedPassword = await bcrypt.hash(newPass, 10);
			await usersService.updateUser(userId, { password: hashedPassword });

			res.clearCookie("recoveryToken");
			res.status(200).json({ message: "Contraseña actualizada exitosamente" });
		} catch (error) {
			console.error("Error al restablecer la contraseña:", error);
			res.status(500).json({ error: "Error al restablecer la contraseña" });
		}
	};
	static switchRole = async (req, res) => {
		try {
			let uid = req.params.uid;
			console.log("id del user a modificar", uid);
			let user = await usersService.getUserBy({ _id: uid });
			console.log("user a modifica:", user);
			if (!user.rol) {
				res.setHeader("Content-Type", "application/json");
				return res
					.status(400)
					.json({ error: "El usuario no posee la propiedad rol" });
			}
			if (user.rol === "user") {
				await usersService.updateUser({ _id: uid }, { rol: "premium" });
				res.setHeader("Content-Type", "application/json");
				return res
					.status(200)
					.json({ payload: `El usuario ${user.email} ahora es premium` });
			}
			if (user.rol === "premium") {
				await usersService.updateUser({ _id: uid }, { rol: "user" });
				res.setHeader("Content-Type", "application/json");
				return res
					.status(200)
					.json({ payload: `El usuario ${user.email} ahora es user` });
			}
		} catch (error) {
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({
				error: `Unexpected server error - contact your administrator,
				  detalle:${error}`,
			});
		}
	};
}
