"use client";

import { useState } from "react";
import styles from "./forms.module.css";
import { createReview } from "@/lib/services/reviews/createReview";
import SuccessMessage from "./_partials/SuccessMessage";
import RatingIcon from "./_partials/RatingIcon";
import FormTextarea from "./_partials/FormTextarea";

interface ReviewFormProps {
	hotelId: string;
}

export default function ReviewForm({ hotelId }: ReviewFormProps) {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [hoverRating, setHoverRating] = useState(0);
	const [rating, setRating] = useState(0);

	async function handleSubmit(formData: FormData) {
		setError(null);
		setSuccess(false);

		formData.set("hotelId", hotelId);
		formData.set("rating", rating.toString());

		const result = await createReview(formData);

		if (result?.error) {
			setError(result.message);
		} else {
			setSuccess(true);
		}
	}

	if (success) return <SuccessMessage message="Review sent successfully!" />;
	else
		return (
			<form action={handleSubmit} className={styles.form}>
				{error && <p className="text-red-600">{error}</p>}

				<div className={styles.form_group}>
					<fieldset className={styles.fieldset}>
						<legend className={styles.fieldset_legend}>Rating</legend>
						<div
							className={styles.rating_group}
							role="radiogroup"
							aria-label="Rating from 1 to 5"
						>
							{[1, 2, 3, 4, 5].map((value) => (
								<label key={value} className={styles.rating_label}>
									<input
										type="radio"
										name="rating"
										value={value.toString()}
										checked={rating === value}
										onChange={() => setRating(value)}
										className={styles.radio_input}
										aria-label={`${value} rating${value > 1 ? "s" : ""}`}
									/>
									<span
										className={styles.rating}
										onMouseEnter={() => setHoverRating(value)}
										onMouseLeave={() => setHoverRating(0)}
									>
										<RatingIcon filled={value <= (hoverRating || rating)} />
									</span>
								</label>
							))}
						</div>
						<p className={styles.selected_rating}>
							Selected:{" "}
							{rating ? `${rating} star${rating > 1 ? "s" : ""}` : "None"}
						</p>
					</fieldset>
				</div>

				<FormTextarea
					label="Message"
					id="message"
					name="message"
					placeholder="Your message"
					required={true}
				/>
				<button type="submit">Add review</button>
			</form>
		);
}
