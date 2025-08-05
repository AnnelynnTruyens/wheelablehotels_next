"use client";

import styles from "../forms.module.css";
import Progress from "./_partials/Progress";

interface Step5Props {
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

export default function Step5({
	hotelId,
	hotelName,
	onSuccess,
	onError,
	errorMessage,
	goToPrevious,
}: Step5Props) {
	return (
		<div className={styles.container_full}>
			<Progress step={5} />
			<h1 className={styles.title}>Overview</h1>
		</div>
	);
}
