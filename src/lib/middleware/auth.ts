import jwt from "jsonwebtoken";
import UserModel from "../modules/User/User.model";
import AuthError from "@/lib/middleware/errors/AuthError";
import { jwtDecode } from "jwt-decode";

const jwtSecret = process.env.JWT_SECRET!;
if (!jwtSecret) throw new Error("JWT_SECRET is not defined.");

export async function verifyJwtToken(token: string) {
	try {
		const decoded = jwt.verify(token, jwtSecret) as { _id: string };
		const user = await UserModel.findById(decoded._id);
		if (!user) throw new AuthError("User not found", 401);
		return user;
	} catch (e) {
		throw new AuthError("Invalid or expired token", 401);
	}
}

export function isTokenExpired(token: string): boolean {
	try {
		const decoded: { exp?: number } = jwtDecode(token);
		if (!decoded.exp) return true;
		return decoded.exp * 1000 < Date.now(); // `exp` is in seconds, JS time is in ms
	} catch (err) {
		return true; // consider invalid token as expired
	}
}

export async function getUserFromRequest(req: Request) {
	const authHeader = req.headers.get("authorization");
	const token = authHeader?.split(" ")[1];

	if (!token) throw new AuthError("Missing token", 401);

	const decoded = jwt.verify(token, jwtSecret) as { _id: string };
	const user = await UserModel.findById(decoded._id);
	if (!user) throw new AuthError("User not found", 401);
	return user;
}
