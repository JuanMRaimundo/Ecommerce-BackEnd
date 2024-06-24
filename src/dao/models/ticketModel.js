import mongoose from "mongoose";

const generateUniqueCode = () => {
	return Math.random().toString(36).substring(2, 9).toUpperCase();
};
const ticketsCollection = "tickets";
const ticketSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			default: generateUniqueCode,
		},
		purchase_datetime: {
			type: Date,
			default: Date.now,
		},
		amount: {
			type: Number,
			required: true,
		},
		purchaser: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
ticketSchema.pre("save", function (next) {
	if (!this.code) {
		this.code = generateUniqueCode();
	}
	next();
});

export const ticektModel = mongoose.model(ticketsCollection, ticketSchema);
