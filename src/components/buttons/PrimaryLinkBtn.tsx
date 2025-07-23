"use client";

import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
	children: ReactNode;
	link: string | Object;
};

export default function PrimaryLinkBtn({ children, link }: ButtonProps) {
	return (
		<Link href={link} className="button">
			{children}
		</Link>
	);
}
