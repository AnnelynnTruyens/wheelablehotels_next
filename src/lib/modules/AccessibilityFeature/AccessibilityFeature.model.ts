import mongoose from "mongoose";
import { AccessibilityFeature } from "./AccessibilityFeature.types";
import validateModel from "../../validation/validateModel";

const accessibilityFeatureSchema = new mongoose.Schema<AccessibilityFeature>(
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

accessibilityFeatureSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

export default mongoose.models.AccessibilityFeature ||
	mongoose.model<AccessibilityFeature>(
		"AccessibilityFeature",
		accessibilityFeatureSchema
	);
