import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import path from "path";
import { router as productRouter } from "./routes/products.router.js";
import { router as cartRouter } from "./routes/cart.router.js";
import { router as viewsRouter } from "./routes/views.router.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* app.use(express.static("./src/public")); */
app.use(express.static(path.join(__dirname, `public`)));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, `views`));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

const serverHTTP = app.listen(PORT, () =>
	console.log(`server online en puerto ${PORT}`)
);

export const io = new Server(serverHTTP);

/* io.on("conection", (socket) => {
	console.log(`conectado el ${socket.id}`);
}); */
