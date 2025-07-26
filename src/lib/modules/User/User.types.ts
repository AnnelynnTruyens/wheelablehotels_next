import { Document } from "mongoose";

export type UserRegister = Document & {
	_id?: string;
	username: string;
	email: string;
	password: string;
	role: string;
};

export type UserMethods = {
	comparePassword: (password: string) => Promise<boolean>;
	generateToken: () => string;
};

export type User = Document &
	UserMethods & {
		_id?: string;
		username: string;
		email: string;
		password: string;
		role: string;
	};
