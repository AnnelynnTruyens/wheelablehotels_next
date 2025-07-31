"use server";

import AccessibilityFeatureModel from "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";
import { connectToDatabase } from "@/lib/mongoose";

export type SerializableAccessibilityFeature = {
	_id: string;
	name: string;
	icon?: string;
};

export async function getAccessibilityFeatures(): Promise<
	SerializableAccessibilityFeature[]
> {
	try {
		await connectToDatabase();

		const features = await AccessibilityFeatureModel.find({});

		// Serialize: remove Mongoose metadata
		return features.map((f) => ({
			_id: f._id.toString(),
			name: f.name,
		}));
	} catch (error) {
		console.error("Error fetching accessibility features:", error);
		throw new Error("Failed to fetch accessibility features");
	}
}
