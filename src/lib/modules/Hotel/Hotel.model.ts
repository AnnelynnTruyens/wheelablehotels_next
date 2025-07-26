import mongoose from "mongoose";

import { Hotel } from "./Hotel.types";

import validateModel from "../../validation/validateModel";
import Room from "../Room/Room.model";
import Image from "../Image/Image.model";

const hotelSchema = new mongoose.Schema<Hotel>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		location: {
			type: String,
			required: false,
		},
		contactEmail: {
			type: String,
			required: false,
		},
		contactPhone: {
			type: String,
			required: false,
		},
		website: {
			type: String,
			required: false,
		},
		accessibilityInfo: {
			type: String,
			required: false,
		},
		rating: {
			type: Number,
			required: false,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		status: {
			type: String,
			required: true,
		},
		amenities: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Amenity",
			},
		],
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

hotelSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

hotelSchema.pre("deleteOne", { document: true, query: false }, function (next) {
	// delete all rooms that belong to this hotel
	Room.deleteMany({ hotelId: this._id }).exec();
	Image.deleteMany({ hotelId: this._id }).exec();
	next();
});

hotelSchema.pre(["findOneAndDelete", "deleteMany"], function (next) {
	// delete all rooms that belong to this hotel
	const id = this.getFilter()["_id"];
	Room.deleteMany({ hotelId: id }).exec();
	Image.deleteMany({ hotelId: id }).exec();
	next();
});

export default mongoose.models.Hotel ||
	mongoose.model<Hotel>("Hotel", hotelSchema);
