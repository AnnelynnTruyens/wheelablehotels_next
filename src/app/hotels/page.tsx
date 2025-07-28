import styles from "./hotels.module.css";
import HotelCard from "@/components/cards/HotelCard";
import NoResults from "@/components/NoResults";
import { getHotels } from "@/lib/services/hotels/getHotels";

export default async function HotelOverview() {
	const hotels = await getHotels();

	return (
		<main id="main" className="main">
			<title>Hotels | Wheelable Hotels</title>
			<h1>Search hotels</h1>
			<div className={styles.content_flex}>
				<div className={styles.hotels}>
					{hotels && hotels.length > 0 ? (
						hotels.map((hotel) => {
							return (
								<HotelCard
									key={`hotel_${hotel._id}`}
									hotelName={hotel.name}
									hotelId={hotel._id}
									location={hotel.location}
									accessibilityFeatures={hotel.accessibilityFeatures}
									rating={hotel.rating}
								/>
							);
						})
					) : (
						<NoResults insert="hotels" />
					)}
				</div>
			</div>
		</main>
	);
}
