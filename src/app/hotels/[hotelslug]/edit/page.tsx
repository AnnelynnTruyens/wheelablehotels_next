import { getHotelBySlug } from "@/lib/services/hotels/getHotelById";
import EditHotel from "./editHotel";
import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/middleware/auth";
import { redirect } from "next/navigation";

interface HotelEditProps {
	params: Promise<{ hotelslug: string }>;
}

export default async function EditHotelPage({ params }: HotelEditProps) {
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;
	const from = "/hotels/add";

	if (!token || isTokenExpired(token)) {
		redirect(`/users/login?from=${encodeURIComponent(from)}`);
	}

	const { hotelslug } = await params;

	const hotel = await getHotelBySlug(hotelslug);
	const addedByUser = hotel.userId.username;
	const hotelStatus = hotel.status;

	return (
		<EditHotel
			hotelId={hotel._id}
			addedByUser={addedByUser}
			hotelStatus={hotelStatus}
		/>
	);
}
