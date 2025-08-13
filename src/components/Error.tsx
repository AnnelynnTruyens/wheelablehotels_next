"use client";

import styles from "./components.module.css";

type ErrorProps = {
	message: string | undefined;
};

export default function Error({ message }: ErrorProps) {
	return (
		<p role="log" className={styles.error}>
			Error: {message}
		</p>
	);
}
