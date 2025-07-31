import { getHotels } from "@/lib/services/hotels/getHotels";
import HotelClient from "./hotelClient";
import { getFirstImageByHotel } from "@/lib/services/images/getFirstImage";

export default async function HotelOverview({
	searchParams,
}: {
	searchParams: { search?: string };
}) {
	const hotels = await getHotels();

	return (
		<main id="main" className="main">
			<title>Hotels | Wheelable Hotels</title>
			<HotelClient
				initialHotels={hotels}
				initialSearchValue={searchParams.search || ""}
			/>
		</main>
	);
}
