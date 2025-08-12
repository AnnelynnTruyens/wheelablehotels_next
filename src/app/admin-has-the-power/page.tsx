import { cookies } from "next/headers";
import AdminHeader from "./_partials/Header";
import styles from "./admin.module.css";
import { isTokenExpired } from "@/lib/middleware/auth";
import { redirect } from "next/navigation";
import { UserInfo } from "@/lib/services/users/types";
import { getCurrentUserInfo } from "@/lib/services/users/getCurrentUserInfo";
import HotelAdminCard from "@/components/cards/HotelAdminCard";
import { getMessages } from "@/lib/services/messages/getMessages";
import MessageAdminCard from "@/components/cards/MessageAdminCard";
import { getAllHotels } from "@/lib/services/hotels/getAllHotels";
import { HotelWithRating } from "@/lib/services/hotels/types";
import { MessageInfo } from "@/lib/services/messages/types";

export default async function AdminDashboard() {
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

	const completedHotels = hotels.filter(
		(hotel) => hotel.status === "completed"
	);

	const messages = await getMessages();

	const newMessages = messages.filter((message) => message.status === "new");

	return (
		<>
			<AdminHeader />
			<main id="main" className={styles.page}>
				<h1>Welcome {user.username}!</h1>
				<div className={styles.dashboard_flex}>
					<section>
						<h2>New hotels</h2>
						{completedHotels && completedHotels.length > 0 ? (
							completedHotels.map((hotel: HotelWithRating) => {
								return (
									<HotelAdminCard
										key={`hotel_${hotel._id}`}
										hotelName={hotel.name}
										hotelSlug={`/hotels/${hotel.slug}`}
										hotelId={hotel._id}
										location={hotel.location}
										from={from}
									/>
								);
							})
						) : (
							<p>You are up to date! Congratulations!</p>
						)}
					</section>
					<section>
						<h2>New messages</h2>
						{newMessages && newMessages.length > 0 ? (
							newMessages.map((message: MessageInfo) => {
								return (
									<MessageAdminCard
										key={`message_${message._id}`}
										messageId={message._id}
										name={message.name}
										message={message.message}
									/>
								);
							})
						) : (
							<p>You are up to date! Congratulations!</p>
						)}
					</section>
				</div>
			</main>
		</>
	);
}
