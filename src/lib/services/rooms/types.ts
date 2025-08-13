export type RoomInfo = {
	_id: string;
	hotelId: string;
	name: string;
	description: string;
	accessibilityInfo: string;
	accessibilityFeatures: { _id: string; name: string }[];
};
