"use client";

import styles from "./cards.module.css";
import Rating from "./partials/rating";

type ReviewCardProps = {
	username: string;
	rating: number;
	review?: string;
};

export default function ReviewCard({
	username,
	rating,
	review,
}: ReviewCardProps) {
	return (
		<div className={styles.review}>
			<div className={styles.review_top}>
				<p className={styles.name}>{username}</p>
				<Rating rating={rating} />
			</div>
			{review ? <p className={styles.review_text}>{review}</p> : null}
		</div>
	);
}
