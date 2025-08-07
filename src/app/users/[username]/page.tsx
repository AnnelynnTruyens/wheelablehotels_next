import { getUserInfo } from "@/lib/services/users/getUserInfo";
import styles from "./userpage.module.css";
import { HotelWithRatingSimple } from "@/lib/services/hotels/types";
import { getHotelsByUser } from "@/lib/services/hotels/getHotelsByUser";
import GoBackBtn from "@/components/buttons/GoBackBtn";
import HotelHighlight from "@/components/cards/HotelHighlight";
import NoResults from "@/components/NoResults";

interface UserPageProps {
	params: Promise<{ username: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
	const { username } = await params;

	const user = await getUserInfo(username);
	const hotels: HotelWithRatingSimple[] = await getHotelsByUser(user._id);

	const publishedHotels = hotels.filter(
		(hotel) => hotel.status === "published"
	);

	return (
		<main id="main" className="main">
			<title>Profile | Wheelable Hotels</title>
			<GoBackBtn>Go back</GoBackBtn>
			<h1>Hotels added by {username}</h1>
			<div className={styles.hotels}>
				{publishedHotels && publishedHotels.length > 0 ? (
					publishedHotels.map((hotel: HotelWithRatingSimple) => {
						return (
							<HotelHighlight
								key={`hotel_${hotel._id}`}
								hotelName={hotel.name}
								pathname={`/hotels/${hotel.slug}`}
								hotelId={hotel._id}
								location={hotel.location}
								rating={hotel.rating}
							/>
						);
					})
				) : (
					<NoResults insert="hotels" />
				)}
			</div>
		</main>
	);
}
