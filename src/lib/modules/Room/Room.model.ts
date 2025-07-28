import mongoose from "mongoose";
import { Room } from "./Room.types";
import validateModel from "../../validation/validateModel";

const roomSchema = new mongoose.Schema<Room>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		accessibilityInfo: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		hotelId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		accessibilityFeatures: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "AccessibilityFeature",
			},
		],
	},
	{
		timestamps: true,
	}
);

roomSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

export default mongoose.models.Room || mongoose.model<Room>("Room", roomSchema);
