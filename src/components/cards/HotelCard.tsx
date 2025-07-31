import styles from "./cards.module.css";
import Rating from "./partials/rating";
import Link from "next/link";
import { getFirstImageByHotel } from "@/lib/services/images/getFirstImage";

type HotelCardProps = {
	hotelName: string;
	hotelId: string;
	location: string | undefined;
	accessibilityFeatures: { _id: string; name: string }[];
	rating: number | undefined;
	imageUrl?: string;
	imageAlt?: string;
};

export default function HotelCard({
	hotelName,
	hotelId,
	location,
	accessibilityFeatures,
	rating,
	imageUrl,
	imageAlt,
}: HotelCardProps) {
	return (
		<div className={styles.hotel_card}>
			<img
				src={imageUrl ? imageUrl : "/Icon_WheelableHotels.png"}
				alt={imageAlt ? imageAlt : "No hotel image found"}
				className={styles.card_img}
			/>
			<div className={styles.card_info}>
				<div className={styles.card_info_left}>
					<Link
						href={{
							pathname: `/hotels/${hotelName}`,
							query: { hotelId },
						}}
						className={styles.card_link}
					>
						<h2 className={styles.card_title}>{hotelName}</h2>
					</Link>
					<p className={styles.card_location}>{location}</p>
					<ul className={styles.card_features}>
						{accessibilityFeatures.map((feature, index) => {
							return (
								<li className={styles.card_li} key={`feature_${index}`}>
									{feature.name}
								</li>
							);
						})}
					</ul>
				</div>
				{rating ? <Rating rating={rating} /> : null}
			</div>
		</div>
	);
}
