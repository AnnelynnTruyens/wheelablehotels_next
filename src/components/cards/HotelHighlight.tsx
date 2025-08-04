import { getFirstImageByHotel } from "@/lib/services/images/getFirstImage";
import styles from "./cards.module.css";
import Rating from "./partials/rating";
import Link from "next/link";

type HotelHighlightProps = {
	hotelName: string;
	hotelSlug: string;
	hotelId: string;
	location: string | undefined;
	rating: number | undefined;
};

export default async function HotelHighlight({
	hotelName,
	hotelSlug,
	hotelId,
	location,
	rating,
}: HotelHighlightProps) {
	const image = await getFirstImageByHotel({ hotelId });

	return (
		<div className={styles.hotel_highlight}>
			<img
				src={image ? image.imageUrl : "/logo/Logo_WheelableHotels.svg"}
				alt={image ? image.alt : "No hotel image found"}
				className={styles.highlight_img}
			/>
			<div className={styles.highlight_info}>
				<Link
					href={{
						pathname: `/hotels/${hotelSlug}`,
					}}
					className={styles.highlight_link}
				>
					<h2 className={styles.highlight_title}>
						{hotelName ? hotelName : "hotel name"}
					</h2>
				</Link>
				<p className={styles.highlight_location}>
					{location ? location : "location"}
				</p>
				{rating ? <Rating rating={rating} /> : null}
			</div>
		</div>
	);
}
