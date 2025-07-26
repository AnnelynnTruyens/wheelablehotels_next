import mongoose from "mongoose";
import { Image } from "./Image.types";
import validateModel from "../../validation/validateModel";

const imageSchema = new mongoose.Schema<Image>(
	{
		name: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		alt: {
			type: String,
			required: true,
		},
		hotelId: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
		},
		roomId: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

imageSchema.virtual("hotel", {
	ref: "Hotel",
	localField: "hotelId",
	foreignField: "_id",
	justOne: true,
});

imageSchema.virtual("room", {
	ref: "Room",
	localField: "roomId",
	foreignField: "_id",
	justOne: true,
});

imageSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

export default mongoose.models.Image ||
	mongoose.model<Image>("Image", imageSchema);
