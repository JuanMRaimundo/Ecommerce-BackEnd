import { CartsMongoDAO as CartsDAO } from "../dao/CartsMongoDAO.js";
import { UsersMongoDAO as UserDAO } from "../dao/UsersMongoDAO.js";
import { ticektModel } from "../dao/models/ticketModel.js";

const cartsDAO = new CartsDAO();
const userDAO = new UserDAO();

export class TicketService {
	static async createTicketFromCart(cartId, userId) {
		let cart = await cartsDAO.getCartById(cartId);

		if (!cart) {
			throw new Error("Carrito no encontrado");
		}
		const user = await userDAO.getUserBy({ _id: userId });
		if (!user) {
			throw new Error("Usuario no encontrado");
		}

		let totalAmount = 0;
		let productsToPurchase = [];

		for (const cartProduct of cart.products) {
			const product = cartProduct.product;
			const quantity = cartProduct.quantity;
			console.log("producto desde el for  " + product);
			console.log("cantidad del producto desde el for  " + quantity);
			if (!product) {
				throw new Error(`Producto no encontrado en el carrito: ${cartProduct}`);
			}

			if (product && product.stock >= quantity) {
				product.stock -= quantity;
				await product.save();

				totalAmount += product.price * quantity;
				productsToPurchase.push({
					product: product._id,
					quantity: quantity,
				});
			} else if (product && product.stock < quantity) {
				console.log(`Stock insuficiente para el producto ${product.title}`);
			} else {
				console.log(
					`Producto ${cartProduct._id} no encontrado o nulo en la base de datos.`
				);
			}
		}
		if (productsToPurchase.length === 0) {
			throw new Error(
				"No hay productos suficientes en stock para completar la compra"
			);
		}
		const newTicket = new ticektModel({
			amount: totalAmount,
			purchaser: user.email,
		});
		await newTicket.save();

		cart.products = [];
		await cart.save();
		return newTicket;
	}
}
