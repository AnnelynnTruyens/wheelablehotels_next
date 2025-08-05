"use client";

import styles from "../forms.module.css";
import Progress from "./_partials/Progress";

interface Step4Props {
	hotelId: string;
	hotelName: string;
	onSuccess: () => void;
	onError: (msg: string) => void;
	errorMessage?: string;
	goToPrevious: () => void;
}

const initialState = {
	error: null,
	success: false,
};

export default function Step4({
	hotelId,
	hotelName,
	onSuccess,
	onError,
	errorMessage,
	goToPrevious,
}: Step4Props) {
	return (
		<div className={styles.container_full}>
			<Progress step={4} />
			<h1 className={styles.title}>Add photos</h1>
		</div>
	);
}
