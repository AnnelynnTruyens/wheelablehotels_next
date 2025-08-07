import styles from "./profile.module.css";
import LogoutButton from "@/components/buttons/LogoutButton";
import PrimaryLinkBtn from "@/components/buttons/PrimaryLinkBtn";
import HotelHighlight from "@/components/cards/HotelHighlight";
import NoResults from "@/components/NoResults";
import { isTokenExpired } from "@/lib/middleware/auth";
import { getHotelsByUser } from "@/lib/services/hotels/getHotelsByUser";
import { HotelWithRatingSimple } from "@/lib/services/hotels/types";
import { getCurrentUserInfo } from "@/lib/services/users/getCurrentUserInfo";
import { UserInfo } from "@/lib/services/users/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Profile() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;
	const from = "/users/profile";

	if (!token || isTokenExpired(token)) {
		redirect(`/users/login?from=${encodeURIComponent(from)}`);
	}

	const user: UserInfo = await getCurrentUserInfo();

	const hotels: HotelWithRatingSimple[] = await getHotelsByUser(user._id);

	const inProgressHotels = hotels.filter((hotel) => hotel.status === "new");
	const completedHotels = hotels.filter(
		(hotel) => hotel.status === "completed"
	);
	const publishedHotels = hotels.filter(
		(hotel) => hotel.status === "published"
	);

	return (
		<main id="main" className="main">
			<title>Dashboard | Wheelable Hotels</title>
			<div className={styles.top}>
				<h1>Welcome {user.username}!</h1>
				<LogoutButton />
			</div>

			<section className={styles.section}>
				<h2>My hotels in progress</h2>
				<p>
					You have started adding these hotels, but haven&apos;t finished all
					the information. Click on the hotel to complete adding the
					information.
				</p>
				<div className={styles.hotels}>
					{inProgressHotels && inProgressHotels.length > 0 ? (
						inProgressHotels.map((hotel: HotelWithRatingSimple) => {
							return (
								<HotelHighlight
									key={`hotel_${hotel._id}`}
									hotelName={hotel.name}
									pathname={`/hotels/${hotel.slug}/edit`}
									hotelId={hotel._id}
									location={hotel.location}
									rating={hotel.rating}
								/>
							);
						})
					) : (
						<NoResults insert="hotels in progress" />
					)}
				</div>
				<PrimaryLinkBtn link="/hotels/add">Add a hotel</PrimaryLinkBtn>
			</section>
			<section className={styles.section}>
				<h2>My completed hotels</h2>
				<p>
					You have added all info for these hotels, the admin has to approve
					them before being published.
				</p>
				<div className={styles.hotels}>
					{completedHotels && completedHotels.length > 0 ? (
						completedHotels.map((hotel: HotelWithRatingSimple) => {
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
						<NoResults insert="completed hotels" />
					)}
				</div>
			</section>
			<section className={styles.section}>
				<h2>My published hotels</h2>
				<p>These are all your hotels that have been published.</p>
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
						<NoResults insert="published hotels" />
					)}
				</div>
			</section>
		</main>
	);
}
