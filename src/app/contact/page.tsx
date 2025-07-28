import Loading from "@/components/Loading";
import { Suspense } from "react";
import Contact from "./contact";

export default function ContactPage() {
	return (
		<Suspense fallback={<Loading />}>
			<Contact />
		</Suspense>
	);
}
