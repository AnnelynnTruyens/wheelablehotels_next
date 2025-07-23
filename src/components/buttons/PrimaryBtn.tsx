"use client";

import { ReactNode } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
};

export default function PrimaryBtn({
	children,
	type = "button",
	...rest
}: ButtonProps) {
	return (
		<button type={type} {...rest}>
			{children}
		</button>
	);
}
