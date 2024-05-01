import { productModel } from "./models/productModel.js";

export class ProductManagerMongo {
	async getProducts() {
		return await productModel.find();
	}
	async getProductBy(filter) {
		return await productModel.findOne(filter);
	}

	/* async getProductByTitle(title) {
		return await productModel.findOne(title);
	} */

	async addProduct(product) {
		return await productModel.create(product);
	}
	async updateProduct(id, upDProductData) {
		return await productModel.findByIdAndUpdate(id, upDProductData, {
			runValidators: true,
			returnDocument: "after",
		});
	}

	async deleteProduct(pid) {
		return await productModel.deleteOne({ _id: pid });
	}
	//dejo comentado el método para generar un número random, por si más adelante me sirve
	/* 	generatingCode() {
		return Math.floor(Math.random() * 1000);
	} */
}
