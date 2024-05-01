import mongoose from "mongoose";

const cartsCollection = "carts";
const cartSchema = new mongoose.Schema(
	{
		products: [
			{
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					default: 1,
				},
			},
		],
	},
	{
		timeseries: true,
	}
);

export const cartsModel = mongoose.model(cartsCollection, cartSchema);
