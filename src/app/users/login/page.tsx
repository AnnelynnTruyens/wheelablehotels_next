"use client";

import LoginForm from "@/components/forms/loginForm";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function Login() {
	return (
		<main id="main" className="main">
			<title>Register | Wheelable Hotels</title>
			<Suspense fallback={<Loading />}>
				<LoginForm />
			</Suspense>
		</main>
	);
}
