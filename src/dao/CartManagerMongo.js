import { cartsModel } from "./models/cartModel.js";

export class CartManagerMongo {
	async generateId() {
		let carts = await this.getCarts();
		let id = 1;
		if (carts.lenght != 0) {
			id = carts[carts.length - 1].id + 1;
			return id;
		}
	}

	async getCarts() {
		return await cartsModel.find();
	}
	async getCartBy(filter) {
		return await cartsModel.findOne({ filter });
	}
	async getCartById(id) {
		return await cartsModel.findOne({ _id: id });
	}
	async createCart(product) {
		return await cartsModel.create(product);
	}
	async addToCart(cid, pid) {
		try {
			let searchCart = await this.getCartById(cid);
			let quantityValidation = searchCart.products.some((p) => p.id == pid);

			if (quantityValidation) {
				let findProduct = searchCart.products.find((p) => p.id == pid);
				findProduct.quantity = findProduct.quantity + 1;
			} else {
				searchCart.products.push({ id: pid, quantity: 1 });
			}

			await searchCart.save();
		} catch (error) {
			console.error(error);
		}
	}

	async upDateCart() {}
	async deleteCart() {}
}
