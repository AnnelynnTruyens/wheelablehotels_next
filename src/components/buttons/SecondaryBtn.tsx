"use client";

import { ReactNode } from "react";
import styles from "./buttons.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
};

export default function SecondaryBtn({
	children,
	type = "button",
	...rest
}: ButtonProps) {
	return (
		<button className={styles.secondary} type={type} {...rest}>
			{children}
		</button>
	);
}
