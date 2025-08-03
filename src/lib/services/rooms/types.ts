export type RoomInfo = {
	_id?: string;
	name: string;
	description: string;
	accessibilityInfo: string;
	accessibilityFeatures: { _id: string; name: string }[];
};
