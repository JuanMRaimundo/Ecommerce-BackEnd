import { UsersMongoDAO } from "../dao/UsersMongoDAO.js";

class UserService {
	constructor(dao) {
		this.usersDAO = dao;
	}

	async getUsers() {
		return await this.usersDAO.getUsers();
	}
	async getUserBy(filter) {
		return await this.usersDAO.getUserBy(filter);
	}
	async getUserByPopulate() {
		return await this.usersDAO.getUserByPopulate();
	}
	async createUser() {
		let newUser = await this.createUser();
		return newUser.toJSON();
	}
	async updateUser(uid, updateData) {
		let data = await this.usersDAO.updateUser(uid, updateData);
		return data;
	}
}

export const usersService = new UserService(new UsersMongoDAO());
