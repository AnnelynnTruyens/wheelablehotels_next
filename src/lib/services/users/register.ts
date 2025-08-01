"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import UserModel from "@/lib/modules/User/User.model";

export type RegisterState =
	| {
			success: true;
			data: { id: string; username: string; email: string; role: string };
	  }
	| { success: false; error: string };

export default async function register(
	prevState: RegisterState,
	formData: FormData
): Promise<RegisterState> {
	try {
		// Extract form fields (you can adjust this to use zod or custom validation)
		const data = {
			username: formData.get("username"),
			email: formData.get("email"),
			password: formData.get("password"),
			role: formData.get("role") ?? "user",
		};

		// Create and save user
		const user = new UserModel(data);
		const result = await user.save();

		// Optional: redirect after success or return data
		return {
			success: true,
			data: {
				username: result.username,
				id: result._id.toString(),
				email: result.email,
				role: result.role,
			},
		};
	} catch (err: any) {
		// Duplicate key error handling (same as original)
		if (err.code === 11000) {
			const duplicatedField = Object.keys(err.keyPattern)[0];
			return {
				success: false,
				error: `A user with that ${duplicatedField} already exists.`,
			};
		}
		return { success: false, error: "Registration failed." };
	}
}
