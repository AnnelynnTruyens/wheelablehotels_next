"use client";

import { ReactNode } from "react";
import styles from "./buttons.module.css";
import { useRouter } from "next/navigation";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
};

export default function GoBackBtn({
	children,
	type = "button",
	...rest
}: ButtonProps) {
	// Define router for goBack function
	const router = useRouter();
	// Function to go back to previous page
	const goBack = () => {
		router.back();
	};

	return (
		<button onClick={goBack} className={styles.back_link} type={type} {...rest}>
			<svg className={styles.back_link_arrow} viewBox="0 0 16 16">
				<path d="M10 12L6 8L10 4" />
			</svg>
			{children}
		</button>
	);
}
