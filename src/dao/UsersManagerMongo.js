import { userModel } from "./models/userModel.js";

export class UsersManagerMongo {
	async getUsers() {
		return await userModel.find();
	}
	async getUserBy(filter = {}) {
		return await userModel.findOne(filter).lean();
	}
	async createUser(user) {
		let newUser = await userModel.create(user);
		return newUser.toJSON();
	}
}
