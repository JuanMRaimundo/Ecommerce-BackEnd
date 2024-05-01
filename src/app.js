import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import path from "path";
import { router as productRouter } from "./routes/products.router.js";
import { router as cartRouter } from "./routes/cart.router.js";
import { router as viewsRouter } from "./routes/views.router.js";
import mongoose from "mongoose";
import { messageModel } from "./dao/models/messageModel.js";
import { disconnect } from "process";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, `public`)));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, `views`));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

const serverHTTP = app.listen(PORT, () =>
	console.log(`Server online en puerto ${PORT}`)
);

export const io = new Server(serverHTTP);

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

let users = []; //array para mostrar en el DOM...

io.on("connection", (socket) => {
	console.log(`conectado el ${socket.id}`);
	socket.on("id", (email) => {
		users.push({ id: socket.id, email });
		socket.emit("prevMessages", messagesArray);
		socket.broadcast.emit("newUser", email);
	});
	socket.on("message", async (email, message) => {
		try {
			const newMessage = new messageModel({ user: email, message });
			await newMessage.save();
			io.emit("newMessage", email, message);
		} catch (error) {
			console.log(`Error ${error.message} al conectar con la BD`);
		}
	});
	socket.on("disconnect", () => {
		let user = users.find((u) => u.id === socket.id);
		if (user) {
			io.emit("userOff", user.email);
		}
	});
});

//juanmr093
//SNSportNudos
//mongodb+srv://juanmr093:SNSportNudos@cluster0.o98kogt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
