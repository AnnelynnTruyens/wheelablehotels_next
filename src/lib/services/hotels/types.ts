// Type for hotel data
export interface HotelWithRatingAndImage {
	_id: string;
	name: string;
	location?: string;
	rating: number;
	status: string;

	amenities: { _id: string; name: string }[];
	accessibilityFeatures: { _id: string; name: string }[];

	imageUrl?: string;
	imageAlt?: string;
}
