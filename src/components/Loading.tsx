"use client";

import { useEffect, useState } from "react";

export default function Loading() {
	const [showLoading, setShowLoading] = useState<boolean>(false);

	// Set timer to wait 1 second before showing the loading indicator
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowLoading(true);
		}, 1000);

		// Cleanup the timer if the component unmounts before the timer completes
		return () => clearTimeout(timer);
	}, []);

	return showLoading ? <p>Loading...</p> : null;
}
