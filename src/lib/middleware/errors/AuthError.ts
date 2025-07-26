import AppError from "./AppError";

export default class AuthError extends AppError {
	constructor(message = "Authentication failed", errorCode: number) {
		super(message, errorCode);
	}
}
