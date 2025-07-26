import mongoose from "mongoose";

import { Message } from "./Message.types";

import validateModel from "../../validation/validateModel";

const messageSchema = new mongoose.Schema<Message>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		hotelId: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
		},
		status: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

messageSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

export default mongoose.models.Message ||
	mongoose.model<Message>("Message", messageSchema);
