import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "./User.types";

const userSchema = new Schema<User>(
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

// Hash password before saving
userSchema.pre<User>("save", function (next) {
	if (!this.isModified("password")) return next();

	bcrypt.hash(this.password, 10, (err, hash) => {
		if (err) return next(err);
		this.password = hash as string;
		next();
	});
});

// Methods
userSchema.methods.comparePassword = function (
	this: User,
	candidatePassword: string
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
			if (err) return reject(err);
			if (typeof isMatch === "undefined") {
				return reject(new Error("isMatch is undefined"));
			}
			resolve(isMatch);
		});
	});
};

// Token generation
userSchema.methods.generateToken = function (): string {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) throw new Error("JWT_SECRET not defined");

	return jwt.sign({ _id: this._id }, jwtSecret, { expiresIn: 60 * 120 });
};

// Remove password from outputs
userSchema.set("toJSON", {
	transform: function (_doc, ret: Partial<User>, _options) {
		delete ret.password;
		return ret;
	},
});
userSchema.set("toObject", {
	transform: function (_doc, ret: Partial<User>, _options) {
		delete ret.password;
		return ret;
	},
});

export default mongoose.models.User || mongoose.model<User>("User", userSchema);
