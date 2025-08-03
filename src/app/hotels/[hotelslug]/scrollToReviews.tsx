"use client";

import { ReviewInfo } from "@/lib/services/reviews/types";

type Props = {
	reviews: ReviewInfo[];
};

export default function ScrollToReviews({ reviews }: Props) {
	return (
		<a
			href="#reviews"
			onClick={(e) => {
				e.preventDefault(); // Prevent default anchor behavior
				const el = document.getElementById("reviews");
				if (el) {
					el.setAttribute("tabIndex", "-1"); // Make it programmatically focusable
					el.focus(); // Move focus for screen readers / accessibility
					el.scrollIntoView({ behavior: "smooth" }); // Optional: scroll
				}
			}}
		>
			{reviews?.length} reviews
		</a>
	);
}
