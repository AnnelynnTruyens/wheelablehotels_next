import styles from "../admin.module.css";
import { getAllHotels } from "@/lib/services/hotels/getAllHotels";
import AdminHeader from "../_partials/Header";
import HotelLine from "../_partials/HotelLine";
import NoResults from "@/components/NoResults";
import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/middleware/auth";
import { redirect } from "next/navigation";
import { UserInfo } from "@/lib/services/users/types";
import { getCurrentUserInfo } from "@/lib/services/users/getCurrentUserInfo";

export default async function AdminHotelOverview() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;
	const from = "/admin-has-the-power";

	if (!token || isTokenExpired(token)) {
		redirect(`/users/login?from=${encodeURIComponent(from)}`);
	}

	const user: UserInfo = await getCurrentUserInfo();

	if (user.role !== "admin") {
		redirect("/");
	}

	const hotels = await getAllHotels();

	return (
		<>
			<AdminHeader />
			<main id="main" className="admin-main">
				<h1>Hotels</h1>
				<table className={styles.table}>
					<tbody>
						<tr className={styles.table_row}>
							<th className={styles.table_head}>Name</th>
							<th className={styles.table_head}>Location</th>
							<th className={styles.table_head}>Status</th>
							<th className={styles.table_head}>Username</th>
							<th className={styles.table_head}>Actions</th>
						</tr>

						{hotels && hotels.length > 0 ? (
							hotels.map((hotel) => {
								return (
									<HotelLine
										key={`hotel_${hotel._id}`}
										hotelId={hotel._id}
										hotelName={hotel.name}
										hotelLocation={hotel.location}
										status={hotel.status}
										username={hotel.userId.username}
										hotelSlug={hotel.slug}
									/>
								);
							})
						) : (
							<NoResults insert="hotels" />
						)}
					</tbody>
				</table>
			</main>
		</>
	);
}
