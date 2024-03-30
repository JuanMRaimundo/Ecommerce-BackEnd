import express from "express";
import { router as productRouter } from "./routes/products.router.js";
import { router as cartRouter } from "./routes/cart.router.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.get("/", (req, res) => {
	res.setHeader(`Content-Type`, `text/plain`);
	res.status(200).send(`API funcionando`);
});

app.listen(PORT, () => console.log(`server online en puerto ${PORT}`));
