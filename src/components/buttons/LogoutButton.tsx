"use client";

import { logout } from "@/lib/services/users/logout";
import { useFormStatus } from "react-dom";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button type="submit" disabled={pending}>
			Logout
		</button>
	);
}

export default function LogoutButton() {
	return (
		<form action={logout}>
			<SubmitButton />
		</form>
	);
}
