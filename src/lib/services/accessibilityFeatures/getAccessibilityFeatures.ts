"use server";

import AccessibilityFeatureModel from "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";
import { AccessibilityFeature } from "@/lib/modules/AccessibilityFeature/AccessibilityFeature.types";
import { connectToDatabase } from "@/lib/mongoose";

export async function getAccessibilityFeatures(): Promise<
	AccessibilityFeature[]
> {
	try {
		await connectToDatabase();
		const accessibilityFeatures = await AccessibilityFeatureModel.find({});
		return accessibilityFeatures;
	} catch (error) {
		console.error("Error fetching accessibility features:", error);
		throw new Error("Failed to fetch accessibility features");
	}
}
