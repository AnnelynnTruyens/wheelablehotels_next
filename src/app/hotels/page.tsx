export const dynamic = "force-dynamic";

import { getHotels } from "@/lib/services/hotels/getHotels";
import HotelClient from "./hotelClient";

type HotelOverviewProps = {
	searchParams?: { search?: string };
};

export default async function HotelOverview({
	searchParams,
}: HotelOverviewProps) {
	const hotels = await getHotels();
	const searchValue = searchParams?.search || "";

	return (
		<main id="main" className="main">
			<title>Hotels | Wheelable Hotels</title>
			<HotelClient initialHotels={hotels} initialSearchValue={searchValue} />
		</main>
	);
}
