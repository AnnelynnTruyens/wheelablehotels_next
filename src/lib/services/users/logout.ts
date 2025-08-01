"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
	// Remove the cookie
	(await cookies()).set("authToken", "", {
		expires: new Date(0),
		path: "/",
	});

	// Optional: Redirect to login or home
	redirect("/");
}
