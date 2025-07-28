import { Document } from "mongoose";

export type AccessibilityFeature = Document & {
	_id: string;
	name: string;
	icon?: string;
};
