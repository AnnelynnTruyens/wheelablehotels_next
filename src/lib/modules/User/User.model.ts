import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "./User.types";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", function (next) {
	const user = this as any;

	if (!user.isModified("password")) return next();

	bcrypt.hash(user.password, 10, (err, hash) => {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

userSchema.methods = {
	comparePassword: function (candidatePassword: string) {
		const user = this;
		return new Promise((resolve, reject) => {
			bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
				if (err) return reject(err);
				if (typeof isMatch === "undefined") {
					return reject(new Error("isMatch is undefined"));
				}
				resolve(isMatch);
			});
		});
	},
	generateToken: function () {
		const user = this;
		return jwt.sign({ _id: user._id }, process.env.JWT_SECRET ?? "", {
			expiresIn: 60 * 120,
		});
	},
};

// Remove password from output
userSchema.set("toJSON", {
	transform: function (doc, ret) {
		delete ret.password;
	},
});
userSchema.set("toObject", {
	transform: function (doc, ret) {
		delete ret.password;
	},
});

export default mongoose.models.User || mongoose.model<User>("User", userSchema);
