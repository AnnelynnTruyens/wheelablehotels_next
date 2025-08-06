"use server";

import AuthError from "@/lib/middleware/errors/AuthError";
import { cookies } from "next/headers";
import { getCurrentUser } from "../users/getCurrentUser";
import FavouriteModel from "@/lib/modules/Favourite/Favourite.model";
import NotFoundError from "@/lib/middleware/errors/NotFoundError";

export async function deleteFavourite(id: string) {
	try {
		const authToken = (await cookies()).get("authToken")?.value;
		if (!authToken) {
			throw new AuthError("Unauthorized", 401);
		}

		const headers = new Headers();
		headers.set("authorization", `Bearer ${authToken}`);
		const user = await getCurrentUser(headers);

		const favourite = await FavouriteModel.findOneAndDelete({
			_id: id,
			userId: user._id,
		});
		if (!favourite) {
			throw new NotFoundError("Favourite not found");
		}

		return { success: true };
	} catch (err) {
		if (err instanceof AuthError || err instanceof NotFoundError) {
			throw err;
		}
		throw new Error("Failed to delete favourite");
	}
}
