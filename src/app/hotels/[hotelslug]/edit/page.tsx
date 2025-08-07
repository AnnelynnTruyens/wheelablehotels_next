import { getHotelBySlug } from "@/lib/services/hotels/getHotelById";
import EditHotel from "./editHotel";

interface HotelEditProps {
	params: Promise<{ hotelslug: string }>;
}

export default async function EditHotelPage({ params }: HotelEditProps) {
	const { hotelslug } = await params;

	const hotel = await getHotelBySlug(hotelslug);

	return <EditHotel hotelId={hotel._id} />;
}
