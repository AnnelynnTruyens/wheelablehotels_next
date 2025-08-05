import { AccessibilityFeature } from "../accessibilityFeatures/types";
import { Amenity } from "../amenities/types";
import { User } from "../users/types";

// Type for hotel data
export interface HotelWithRating {
	_id: string;
	name: string;
	slug: string;
	location?: string;
	contactEmail?: string;
	contactPhone?: string;
	website?: string;
	accessibilityInfo?: string;
	rating?: number;
	userId: User;
	status: string;

	amenities: Amenity[];
	accessibilityFeatures: AccessibilityFeature[];
}

export interface HotelWithRatingAndImage {
	_id: string;
	name: string;
	slug: string;
	location?: string;
	rating?: number;
	status: string;

	amenities: Amenity[];
	accessibilityFeatures: AccessibilityFeature[];

	imageUrl?: string;
	imageAlt?: string;
}

export interface HotelWithRatingSimple {
	_id: string;
	name: string;
	slug: string;
	location?: string;
	rating?: number;
	status: string;
}

export interface HotelBody {
	name: string;
	slug: string;
	location?: string;
	contactEmail?: string;
	contactPhone?: string;
	website?: string;
	accessibilityInfo?: string;
	rating?: number;
	status: string;
	amenities: Amenity[];
	accessibilityFeatures: AccessibilityFeature[];
	userId: User;
}
