import { afterEach, describe, it, before } from "mocha";
import { config } from "../../src/config/config.js";
import { usersService } from "../../src/repository/users.service.js";
import supertest from "supertest";

import { expect } from "chai";
import mongoose from "mongoose";
import { UsersMongoDAO } from "../../src/dao/UsersMongoDAO.js";

const requester = supertest("http://localhost:8080");

const connDB = async () => {
	try {
		await mongoose.connect(config.MONGO_URL, {
			dbName: config.DB_NAME,
		});
		console.log("DB conectada");
	} catch (error) {
		console.log(`Error al conectar a la BD: ${error}`);
	}
};
connDB();

describe("Test  for sessions router", function () {
	this.timeout(10000);

	describe("Test for Sessions Router", function () {
		before(function () {
			this.daoUsers = new UsersMongoDAO();
		});
		afterEach(async function () {
			await mongoose.connection
				.collection("users")
				.deleteMany({ email: "userMock@mock.com" });
		});

		it("The DAO, in its get method, returns an array of carts", async function () {
			let result = await this.daoUsers.getUsers();
			expect(Array.isArray(result)).to.be.equal(true);
			if (Array.isArray(result) && result.length > 0) {
				let user = result[0];
				expect(user._id).exist;
				expect(user).to.have.property("_id");
				expect(Object.keys(user).includes("_id")).to.exist;
			}
		});
		/* 
		it("The sessions router at post method, create an user", async () => {
			let mockUser = {
				first_name: "Mocker",
				last_name: "UserM",
				email: "userMock@mock.com",
				age: 24,
				password: "123",
				rol: "admin",
			};
			let { _body } = await requester
				.post("/api/sessions/registration")
				.send(mockUser);
			console.log("body del registration", _body);

			expect(_body.status).to.exist;
			expect(_body.payload).to.exist.and.to.be.equal("Registro exitoso");
		}); */
	});
});
