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

	return (
		<main id="main" className="main">
			<title>Profile | Wheelable Hotels</title>
			<GoBackBtn>Go back</GoBackBtn>
			<h1>Hotels added by {username}</h1>
			<div className={styles.hotels}>
				{hotels && hotels.length > 0 ? (
					hotels.map((hotel: HotelWithRatingSimple) => {
						return (
							<HotelHighlight
								key={`hotel_${hotel._id}`}
								hotelName={hotel.name}
								hotelSlug={hotel.slug}
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

	return <div>Dit is een user page</div>;
}
