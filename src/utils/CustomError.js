import { ERROR_TYPES } from "./Enum-error.js";

export class CustomError {
	static createUserError(
		name = "User-Error",
		cause,
		message,
		code = ERROR_TYPES.INTERNAL_SERVER_ERROR
	) {
		const error = new Error(message, { cause: cause });
		error.name = name;
		error.code = code;

		throw error;
	}
	static createProductError(
		name = "Product-Error",
		cause,
		message,
		code = ERROR_TYPES.DATA_TYPE
	) {
		const error = new Error(message);
		error.name = name;
		error.code = code;
		if (cause) {
			error.cause = cause;
		}

		throw error;
	}
	static createCartError(
		name = "Cart-Error",
		cause,
		message,
		code = ERROR_TYPES.DATA_TYPE
	) {
		const error = new Error(message, { cause: cause });
		error.name = name;
		error.code = code;

		throw error;
	}
}
