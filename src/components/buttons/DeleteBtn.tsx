"use client";

import styles from "./buttons.module.css";
import { useFormStatus } from "react-dom";

interface DeleteBtnProps {
	action: () => void;
}

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button type="submit" disabled={pending} className={styles.delete}>
			Delete
		</button>
	);
}

export default function DeleteButton({ action }: DeleteBtnProps) {
	return (
		<form action={action}>
			<SubmitButton />
		</form>
	);
}
