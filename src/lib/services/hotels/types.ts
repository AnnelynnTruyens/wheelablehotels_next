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
	userId: { _id?: string; username: string };
	status: string;

	amenities: { _id: string; name: string }[];
	accessibilityFeatures: { _id: string; name: string }[];
}

export interface HotelWithRatingAndImage {
	_id: string;
	name: string;
	slug: string;
	location?: string;
	rating?: number;
	status: string;

	amenities: { _id: string; name: string }[];
	accessibilityFeatures: { _id: string; name: string }[];

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
