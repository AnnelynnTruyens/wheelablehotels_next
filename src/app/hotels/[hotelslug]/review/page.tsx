import { getHotelById } from "@/lib/services/hotels/getHotelById";
import styles from "../../hotels.module.css";
import ReviewForm from "@/components/forms/reviewForm";

interface ReviewProps {
	params: Promise<{ hotelslug: string }>;
}

export default async function Review({ params }: ReviewProps) {
	const { hotelslug } = await params;

	const hotel = await getHotelById(hotelslug);

	return (
		<main id="main" className="main">
			<h1 className={styles.review_title}>Add review</h1>
			<p className={styles.review_text}>Hotel: {hotel.name}</p>
			<ReviewForm hotelId={hotel._id} />
		</main>
	);
}
