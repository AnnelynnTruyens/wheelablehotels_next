"use client";

import Link from "next/link";
import styles from "./buttons.module.css";
import { ReactNode } from "react";

type ButtonProps = {
	children: ReactNode;
	link: string | Object;
};

export default function SecondaryLinkBtn({ children, link }: ButtonProps) {
	return (
		<Link href={link} className={`${styles.secondary} button`}>
			{children}
		</Link>
	);
}
