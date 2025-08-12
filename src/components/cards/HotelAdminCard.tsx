import styles from "./cards.module.css";
import Rating from "./partials/rating";
import Link from "next/link";

type HotelCardProps = {
	hotelName: string;
	hotelSlug: string;
	hotelId: string;
	location: string | undefined;
	from: string;
};

export default function HotelAdminCard({
	hotelName,
	hotelSlug,
	hotelId,
	location,
	from,
}: HotelCardProps) {
	return (
		<div className={styles.hotel_card}>
			<div className={styles.card_info}>
				<div className={styles.card_info_left}>
					<Link
						href={`${hotelSlug}/edit?from=${encodeURIComponent(from)}`}
						className={styles.card_link}
					>
						<h2 className={styles.card_title}>{hotelName}</h2>
					</Link>
					<p className={styles.card_location}>{location}</p>
				</div>
			</div>
		</div>
	);
}
