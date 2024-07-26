import mongoose from "mongoose";

const usersCollection = "users";
const userSchema = new mongoose.Schema(
	{
		first_name: { type: String, require: true },
		last_name: { type: String, require: true },
		email: { type: String, require: true, unique: true },
		age: { type: Number, require: true },
		password: { type: String, require: true },
		rol: {
			type: String,
			enum: ["admin", "premium", "user"],
			default: "user",
			required: true,
		},
		cart: {
			type: mongoose.Types.ObjectId,
			ref: "carts",
		},
	},
	{
		timestamps: true,
		strict: false,
	}
);

export const userModel = mongoose.model(usersCollection, userSchema);
