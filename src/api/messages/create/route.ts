"use server";

import { handleApiError } from "@/lib/middleware/errors/handleApiError";
import Message from "@/lib/modules/Message/Message.model";
import { connectToDatabase } from "@/lib/mongoose";
import { redirect } from "next/navigation";

export async function createMessage(formData: FormData) {
	try {
		await connectToDatabase();

		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const message = formData.get("message") as string;
		const hotelId = formData.get("hotelId") as string;

		if (!name || !email || !message) {
			throw new Error("Missing required fields");
		}

		const newMessage = new Message({
			name,
			email,
			message,
			hotelId,
			status: "new",
		});

		await newMessage.save();
		return { success: true };
	} catch (err: unknown) {
		console.error("Server action failed:", err);
		// Do NOT return a complex object or class instance — keep it simple
		return { error: true, message: "Failed to submit message." };
	}

	redirect("/contact/success");
}
