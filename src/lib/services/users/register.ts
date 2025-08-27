"use server";

import UserModel from "@/lib/modules/User/User.model";
import { connectToDatabase } from "@/lib/mongoose";

export type RegisterState =
	| {
			success: true;
			data: { id: string; username: string; email: string; role: string };
	  }
	| { success: false; error: string };

// Only allow letters, numbers, underscores, and hyphens
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export default async function register(
	prevState: RegisterState,
	formData: FormData
): Promise<RegisterState> {
	try {
		await connectToDatabase();

		// Extract form fields
		const username = formData.get("username")?.toString().trim() ?? "";
		const email = formData.get("email")?.toString().trim() ?? "";
		const password = formData.get("password")?.toString() ?? "";
		const role = formData.get("role")?.toString() ?? "user";

		// ✅ Validate username
		if (!USERNAME_REGEX.test(username)) {
			return {
				success: false,
				error:
					"Usernames may only contain letters, numbers, underscores (_) and hyphens (-).",
			};
		}

		if (username.length < 3 || username.length > 20) {
			return {
				success: false,
				error: "Username must be between 3 and 20 characters.",
			};
		}

		// Create and save user
		const user = new UserModel({ username, email, password, role });
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
	} catch (err) {
		if (err instanceof Error) {
			const errorWithCode = err as {
				code?: number;
				keyPattern?: Record<string, unknown>;
			};

			if (errorWithCode.code === 11000 && errorWithCode.keyPattern) {
				const duplicatedField = Object.keys(errorWithCode.keyPattern)[0];
				return {
					success: false,
					error: `A user with that ${duplicatedField} already exists.`,
				};
			}

			return {
				success: false,
				error: err.message || "Registration failed.",
			};
		}

		return {
			success: false,
			error: "An unknown error occurred during registration.",
		};
	}
}
