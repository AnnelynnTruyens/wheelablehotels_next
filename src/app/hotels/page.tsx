export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Loading from "@/components/Loading";
import HotelOverview from "./hotels";

export default async function HotelOverviewPage() {
	return (
		<Suspense fallback={<Loading />}>
			<HotelOverview />
		</Suspense>
	);
}
