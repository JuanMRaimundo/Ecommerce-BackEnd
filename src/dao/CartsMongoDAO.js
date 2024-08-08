import { cartsModel } from "./models/cartModel.js";
import mongoose from "mongoose";
import { ticektModel } from "./models/ticketModel.js";

export class CartsMongoDAO {
	async generateId() {
		let carts = await this.getCarts();
		let id = 1;
		if (carts.length != 0) {
			id = carts[carts.length - 1].id + 1;
			return id;
		}
	}

	async getCarts() {
		//correcto
		let carts = await cartsModel
			.find()
			.populate({ path: "products.product" })
			.lean();
		//console.log(JSON.stringify(carts, null, 5));
		return carts;
	}
	async getCartBy(filter) {
		return await cartsModel.findOne({ filter }).lean();
	}
	async getCartById(id) {
		//correcto
		return await cartsModel.findOne({ _id: id }).populate("products.product");
	}
	async getCartByIdForCartView(id) {
		//correcto
		return await cartsModel
			.findOne({ _id: id })
			.populate("products.product")
			.lean();
	}
	async createCart(product) {
		//correcto
		return await cartsModel.create(product);
	}
	async addToCart(cid, pid) {
		//correcto
		try {
			let searchCart = await this.getCartById(cid);
			console.log(searchCart);
			let productIndex = searchCart.products.findIndex(
				(p) => p.product._id.toString() === pid
			);

			if (productIndex !== -1) {
				searchCart.products[productIndex].quantity += 1;
			} else {
				searchCart.products.push({
					product: new mongoose.Types.ObjectId(pid),
					quantity: 1,
				});
			}

			await searchCart.save();
			return searchCart;
		} catch (error) {
			console.error(error);
		}
	}

	async upDateCart(cid, pid, quantity) {
		//correcto
		try {
			let updatedCart = await cartsModel
				.findOneAndUpdate(
					{ _id: cid, "products.product": pid },
					{ $set: { "products.$.quantity": quantity } },
					{ new: true }
				)
				.populate("products.product");
			console.log({ quantity });
			console.log(updatedCart);
			let cart = await cartsModel
				.findOne({ _id: cid })
				.populate("products.product");
			console.log(cart); // Verificar el carrito actualizado
			return updatedCart;
		} catch (error) {
			console.error(error);
			throw new Error(
				"Error al actualizar la cantidad del producto en el carrito"
			);
		}
	}
	async upDateQuantityCart(cid, pid, quantity) {
		//correcto
		try {
			let updatedCart = await cartsModel
				.findOneAndUpdate(
					{ _id: cid, "products.product": pid },
					/* {products: {pid}}, */
					{ $set: { "products.$.quantity": quantity } },
					{ new: true }
				)
				.populate("products.product");
			console.log({ quantity });
			console.log(updatedCart);
			return updatedCart;
		} catch (error) {
			console.error(error);
			throw new Error(
				"Error al actualizar la cantidad del producto en el carrito"
			);
		}
	}
	async deleteEveryProducts(cid) {
		try {
			let updatedCart = await cartsModel.findOneAndUpdate(
				{ _id: cid },
				{ $pull: { products: {} } },
				{ new: true }
			);
			return updatedCart;
		} catch (error) {
			console.error(error);
			console.error("Error al eliminar todos los productos del carrito");
		}
	}

	async deleteProduct(cid, pid) {
		//correcto
		try {
			let updatedCart = await cartsModel.findOneAndUpdate(
				{ _id: cid },
				{ $pull: { products: { product: pid } } },
				{ new: true }
			);
			return updatedCart;
		} catch (error) {
			console.error(error);
			console.error("Error al eliminar el producto del carrito");
		}
	}
	async createPurchase(cid) {
		return await ticektModel.create(cid);
	}
}
