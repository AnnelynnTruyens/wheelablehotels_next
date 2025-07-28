// Type for hotel data
export interface HotelWithRating {
	_id: string;
	name: string;
	location?: string;
	rating: number;
	status: string;

	amenities: { _id: string; name: string }[];
	accessibilityFeatures: { _id: string; name: string }[];
}
