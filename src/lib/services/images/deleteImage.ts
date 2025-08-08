"use server";

import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

import ImageModel from "@/lib/modules/Image/Image.model";
import AuthError from "@/lib/middleware/errors/AuthError";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import { getCurrentUser } from "../users/getCurrentUser";
import { connectToDatabase } from "@/lib/mongoose";

export async function deleteImage(id: string) {
	try {
		await connectToDatabase();

		const authToken = (await cookies()).get("authToken")?.value;
		if (!authToken) {
			throw new AuthError("Unauthorized", 401);
		}

		const headers = new Headers();
		headers.set("authorization", `Bearer ${authToken}`);
		const user = await getCurrentUser(headers);

		let image;
		if (user.role === "admin") {
			image = await ImageModel.findOneAndDelete({ _id: id });
		} else {
			image = await ImageModel.findOneAndDelete({ _id: id, userId: user._id });
		}

		if (!image) {
			throw new NotFoundError("Image not found");
		}

		// Construct the full file path using `process.cwd()`
		const filePath = path.join(process.cwd(), "public", image.imageUrl);

		// Delete the file from the filesystem
		try {
			await fs.unlink(filePath);
		} catch (fileErr) {
			console.error("Failed to delete image file:", fileErr);
		}

		return;
	} catch (err) {
		if (err instanceof AuthError || err instanceof NotFoundError) {
			throw err;
		}
		console.error("Failed to delete image:", err);
		throw new Error("Failed to delete image");
	}
}
