import { isTokenExpired } from "@/lib/middleware/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddHotelFlow from "./addHotelFlow";

export default async function AddHotel() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;
	const from = "/hotels/add";

	if (!token || isTokenExpired(token)) {
		redirect(`/users/login?from=${encodeURIComponent(from)}`);
	}

	return (
		<main id="main">
			<title>Add hotel | Wheelable Hotels</title>
			<AddHotelFlow />
		</main>
	);
}
