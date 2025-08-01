"use server";

import UserModel from "@/lib/modules/User/User.model";
import { cookies } from "next/headers";

export type LoginState =
	| {
			success: true;
			token: string;
	  }
	| {
			success: false;
			error: string;
	  };

export default async function login(
	prevState: LoginState,
	formData: FormData
): Promise<LoginState> {
	try {
		const email = formData.get("email")?.toString() || "";
		const password = formData.get("password")?.toString() || "";

		if (!email || !password) {
			return {
				success: false,
				error: "Email and password are required.",
			};
		}

		const user = await UserModel.findOne({ email }).select("+password");
		if (!user || !(await user.comparePassword(password))) {
			return {
				success: false,
				error: "Invalid email or password.",
			};
		}

		const token = user.generateToken();

		// Store the token in an HttpOnly cookie
		(await cookies()).set("authToken", token, {
			httpOnly: true,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		return {
			success: true,
			token,
		};
	} catch (err) {
		if (err instanceof Error) {
			console.error("Login error:", err.message);
		}

		return {
			success: false,
			error: "Login failed. Please try again.",
		};
	}
}
