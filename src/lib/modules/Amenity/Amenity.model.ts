"use server";
import mongoose from "mongoose";
import { Amenity } from "./Amenity.types";
import validateModel from "../../validation/validateModel";

const amenitySchema = new mongoose.Schema<Amenity>(
	{
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

amenitySchema.pre("save", function (next) {
	validateModel(this);
	next();
});

export default mongoose.models.Amenity ||
	mongoose.model<Amenity>("Amenity", amenitySchema);
