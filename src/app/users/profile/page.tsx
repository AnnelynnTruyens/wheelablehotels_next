import LogoutButton from "@/components/buttons/LogoutButton";
import { isTokenExpired } from "@/lib/middleware/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Profile() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;
	const from = "/users/profile";

	if (!token || isTokenExpired(token)) {
		redirect(`/users/login?from=${encodeURIComponent(from)}`);
	}
	return (
		<div>
			Dit is de profielpagina
			<LogoutButton />
		</div>
	);
}
