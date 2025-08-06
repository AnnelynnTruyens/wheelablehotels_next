import { getHotelBySlug } from "@/lib/services/hotels/getHotelById";
import styles from "../../hotels.module.css";
import ReviewForm from "@/components/forms/reviewForm";
import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/middleware/auth";
import { redirect } from "next/navigation";

interface ReviewProps {
	params: Promise<{ hotelslug: string }>;
}

export default async function Review({ params }: ReviewProps) {
	const { hotelslug } = await params;
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;
	const from = `/hotels/${hotelslug}/review`;

	if (!token || isTokenExpired(token)) {
		redirect(`/users/login?from=${encodeURIComponent(from)}`);
	}

	const hotel = await getHotelBySlug(hotelslug);

	return (
		<main id="main" className="main">
			<h1 className={styles.review_title}>Add review</h1>
			<p className={styles.review_text}>Hotel: {hotel.name}</p>
			<ReviewForm hotelId={hotel._id} />
		</main>
	);
}
