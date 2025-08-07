import { HotelWithRatingSimple } from "@/lib/services/hotels/types";
import styles from "./favourites.module.css";
import { getFavouritesByUser } from "@/lib/services/favourites/getFavouritesByUser";
import NoResults from "@/components/NoResults";
import HotelHighlight from "@/components/cards/HotelHighlight";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isTokenExpired } from "@/lib/middleware/auth";

export const dynamic = "force-dynamic";

export default async function Favourites() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;
	const from = "/users/profile/favourites";

	if (!token || isTokenExpired(token)) {
		redirect(`/users/login?from=${encodeURIComponent(from)}`);
	}

	const favourites: HotelWithRatingSimple[] = await getFavouritesByUser();

	return (
		<main id="main" className="main">
			<title>Favourites | Wheelable Hotels</title>
			<h1>Favourites</h1>
			<div className={styles.favourites}>
				{favourites && favourites.length > 0 ? (
					favourites.map((favourite: HotelWithRatingSimple) => {
						return (
							<HotelHighlight
								key={`favourite_${favourite._id}`}
								hotelName={favourite.name}
								pathname={`/hotels/${favourite.slug}`}
								hotelId={favourite._id}
								location={favourite.location}
								rating={favourite.rating}
							/>
						);
					})
				) : (
					<NoResults insert="favourites" />
				)}
			</div>
		</main>
	);
}
