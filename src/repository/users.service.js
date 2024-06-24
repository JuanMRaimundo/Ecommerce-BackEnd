import { UsersMongoDAO } from "../dao/UsersMongoDAO.js";

class UserService {
	constructor(dao) {
		this.usersDAO = dao;
	}

	async getUsers() {
		return await this.usersDAO.getUsers();
	}
	async getUserBy() {
		return await this.usersDAO.getUserBy();
	}
	async getUserByPopulate() {
		return await this.usersDAO.getUserByPopulate();
	}
	async createUser() {
		let newUser = await this.createUser();
		return newUser.toJSON();
	}
}

export const usersService = new UserService(new UsersMongoDAO());
