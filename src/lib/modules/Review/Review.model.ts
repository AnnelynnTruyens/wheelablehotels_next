import mongoose from "mongoose";

import { Review } from "./Review.types";

import validateModel from "../../validation/validateModel";

const reviewSchema = new mongoose.Schema<Review>(
	{
		message: {
			type: String,
			required: false,
		},
		rating: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		hotelId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

reviewSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

export default mongoose.models.Review ||
	mongoose.model<Review>("Review", reviewSchema);
