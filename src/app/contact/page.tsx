import Loading from "@/components/Loading";
import { Suspense } from "react";
import Contact from "./contact";
import { UserInfo } from "@/lib/services/users/types";
import { getCurrentUserInfo } from "@/lib/services/users/getCurrentUserInfo";
import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/middleware/auth";

export default async function ContactPage() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;

	let user: UserInfo | undefined = undefined;

	if (token && !isTokenExpired(token)) {
		user = await getCurrentUserInfo();
	}

	return (
		<Suspense fallback={<Loading />}>
			<Contact userEmail={user?.email} username={user?.username} />
		</Suspense>
	);
}
