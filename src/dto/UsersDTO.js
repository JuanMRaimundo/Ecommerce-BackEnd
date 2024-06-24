export class UsersDTO {
	constructor(user) {
		this.firstName = user.first_name.toUpperCase();
		this.lastName = user.last_name ? user.last_name.toUpperCase() : null;
		this.fullName = user.last_name
			? `${this.firstName} ${this.lastName}`
			: this.firstName;
		this.email = user.email;
		this.age = user.age;
		this.rol = user.rol;
		this.cart = user.cart;
	}
}
