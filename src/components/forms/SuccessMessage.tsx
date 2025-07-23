"use client";

import styles from "./forms.module.css";

type SuccessMessageProps = {
	message: string;
};

export default function SuccessMessage({ message }: SuccessMessageProps) {
	return <p className={styles.success}>{message}</p>;
}
