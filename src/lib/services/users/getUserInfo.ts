import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import UserModel from "@/lib/modules/User/User.model";
import { connectToDatabase } from "@/lib/mongoose";
import { UserInfo } from "./types";

export async function getUserInfo(username: string): Promise<UserInfo> {
	try {
		await connectToDatabase();

		const user = await UserModel.findOne({ username: username });

		if (!user) {
			throw new NotFoundError("User not found");
		}

		const userInfo: UserInfo = {
			_id: user._id.toString(),
			username: user.username,
			email: user.email,
			role: user.role,
		};

		return userInfo;
	} catch (err) {
		if (err instanceof NotFoundError) {
			throw err;
		}
		throw new Error("Userinfo couldn't be fetched");
	}
}
