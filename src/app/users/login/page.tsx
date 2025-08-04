"use client";

import LoginForm from "@/components/forms/loginForm";
import { useSearchParams } from "next/navigation";

export default function Login() {
	const searchParams = useSearchParams();
	const from = searchParams.get("from") || "/users/profile";

	return (
		<main id="main" className="main">
			<title>Register | Wheelable Hotels</title>
			<LoginForm from={from} />
		</main>
	);
}
