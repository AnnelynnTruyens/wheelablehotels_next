export type ReviewInfo = {
	_id?: string;
	message?: string;
	rating: number;
	status: string;
	userId: { _id?: string; username: string };
};
