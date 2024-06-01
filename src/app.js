import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";

import passport from "passport";
import path from "path";
//import sessions from "express-session";
import mongoose from "mongoose";

import { router as productRouter } from "./routes/products.router.js";
import { router as cartRouter } from "./routes/cart.router.js";
import { router as viewsRouter } from "./routes/views.router.js";
import { router as sessionsRouter } from "./routes/sessions.router.js";
import { messageModel } from "./dao/models/messageModel.js";
import { productModel } from "./dao/models/productModel.js";
import __dirname from "./utils.js";
import { initPassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, `public`)));
app.use(cookieParser());

/* app.use(
	sessions({
		secret: "SNSCoderEC",
		resave: true,
		saveUninitialized: true,
		store: MongoStore.create({
			ttl: 3600,
			mongoUrl:
				"mongodb+srv://juanmr093:SNSportNudos@cluster0.o98kogt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
			dbName: "SNSport-EC",
			collectionName: "sessionsSNS",
		}),
	})
); */
initPassport();
app.use(passport.initialize());
/* app.use(passport.session()); */ //solo si usamos sessions

//HANDLEBARS CONFIGURATION
app.engine("handlebars", engine());

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, `views`));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const serverHTTP = app.listen(PORT, () =>
	console.log(`Server online en puerto ${PORT}`)
);

export const io = new Server(serverHTTP);

//MONGO DB ATLAS CONFIGURATION
const connDB = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://juanmr093:SNSportNudos@cluster0.o98kogt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
			{ dbName: "SNSport-EC" }
		);
		console.log("DB SNSport online!");
	} catch (error) {
		console.log("Error al conectar a la DB", error.message);
	}
};
connDB();

//CHAT CONFIGURATION

let users = []; //array para mostrar en el DOM...

const getPreviousMessages = async () => {
	try {
		const messages = await messageModel.find();
		return messages;
	} catch (error) {
		console.log("Error al obtener mensajes previos:", error.message);
		return [];
	}
};

io.on("connection", async (socket) => {
	console.log(`conectado el ${socket.id}`);
	let products;
	try {
		products = await productModel.find();
		socket.emit("products", products);
		const prevMessages = await getPreviousMessages();
		socket.emit("prevMessages", prevMessages);
	} catch (error) {
		console.log(
			"Error al enviar mensajes previos o productos al cliente:",
			error.message
		);
	}

	socket.on("id", (user) => {
		try {
			users.push({ id: socket.id, user });
			socket.broadcast.emit("newUser", user);
		} catch (error) {
			console.log(`Error ${error.message} al conectar con la BD`);
		}
	});
	socket.on("message", async (user, message) => {
		try {
			const newMessage = new messageModel({ user: user, message });
			await newMessage.save();
			io.emit("newMessage", user, message);
		} catch (error) {
			console.log(`Error ${error.message} al conectar con la BD`);
		}
	});
	socket.on("addProductForm", async (producto) => {
		const newProduct = await productModel.create({ ...producto });
		if (newProduct) {
			socket.emit("newProduct", newProduct);
		}
	});

	socket.on("deleteProduct", async (productId) => {
		console.log(productId);
		try {
			await productModel.findByIdAndDelete(productId);
			socket.emit("deletedProduct", productId);
		} catch (error) {
			console.log(`Error al eliminar el producto: ${error.message}`);
		}
	});
	socket.on("disconnect", () => {
		let user = users.find((u) => u.id === socket.id);
		if (user) {
			io.emit("userOff", user.email);
		}
	});
});

//el Servidor espera el evento para agregar el producto solicitado por el cliente

//juanmr093
//SNSportNudos
//adminCoder123
//mongodb+srv://juanmr093:SNSportNudos@cluster0.o98kogt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
