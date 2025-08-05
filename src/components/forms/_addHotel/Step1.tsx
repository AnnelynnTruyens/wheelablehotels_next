"use client";
import styles from "../forms.module.css";
import Progress from "./_partials/Progress";
import FormInput from "../_partials/FormInput";
import Link from "next/link";
import { createHotel } from "@/lib/services/hotels/createHotel";
import { useActionState, useEffect } from "react";

interface Step1Props {
	onSuccess: (hotelId: string, hotelName: string) => void;
	onError: (message: string) => void;
	errorMessage?: string;
}

const initialState = {
	success: false,
	error: null,
	data: null,
};

export default function Step1({
	onSuccess,
	onError,
	errorMessage,
}: Step1Props) {
	const [formState, formAction] = useActionState(createHotel, initialState);

	useEffect(() => {
		if (formState.success && formState.data) {
			onSuccess(formState.data._id, formState.data.name);
		}
		if (formState.error) {
			onError(formState.error);
		}
	}, [formState, onSuccess, onError]);

	return (
		<div className={styles.container_full}>
			<Progress step={1} />
			<h1 className={styles.title}>Add hotel</h1>
			<form className={styles.form} action={formAction}>
				<FormInput
					label="Name hotel"
					type="text"
					id="hotelName"
					name="hotelName"
					placeholder="Brussels Plaza Hotel"
					required={true}
				/>
				{errorMessage && <p className={styles.error}>{errorMessage}</p>}
				<div className={styles.buttons}>
					<Link href="/">Cancel</Link>
					<button type="submit">Next</button>
				</div>
			</form>
		</div>
	);
}
