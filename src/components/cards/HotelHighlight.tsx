"use client";

import { useState } from "react";
import styles from "./cards.module.css";
import Rating from "./partials/rating";
import Link from "next/link";

type HotelHighlightProps = {
	hotelName: string;
	hotelId: string;
	location: string | undefined;
	rating: number | undefined;
};

export default function HotelHighlight({
	hotelName,
	hotelId,
	location,
	rating,
}: HotelHighlightProps) {
	const [image, setImage] = useState();

	// useEffect(() => {
	// 	getImagesByHotel({ hotelId })
	// 		.then((response) => {
	// 			if (response.data && response.data.length > 0) {
	// 				setImage(response.data[0]); // Set the first image
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.error("Failed to fetch hotel image:", error);
	// 		});
	// }, [hotelId]);

	return (
		<div className={styles.hotel_highlight}>
			{/* <img
				src={
					image
						? `${process.env.VITE_SERVER_URL}${image.imageUrl}`
						: "/Icon_wheelchair_blue-white.png"
				}
				alt={image ? `${image.alt}` : "No hotel image found"}
				className={styles.highlight_img}
			/> */}
			<img
				src="/globe.svg"
				alt="No hotel image found"
				className={styles.card_img}
			/>
			<div className={styles.highlight_info}>
				<Link
					href={{
						pathname: `/hotels/${hotelName}`,
						query: { hotelId },
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
