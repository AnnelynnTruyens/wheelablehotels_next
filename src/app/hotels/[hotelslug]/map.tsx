"use client";

import styles from "../hotels.module.css";
import Error from "@/components/Error";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

type MapProps = {
	lat: number;
	lng: number;
};

export default function HotelMap({ lat, lng }: MapProps) {
	const key = process.env.GOOGLE_MAPS_API_KEY;

	// Make sure these are plain numbers and a plain object literal.
	const center = useMemo(() => {
		const nlat = Number(lat);
		const nlng = Number(lng);
		if (!Number.isFinite(nlat) || !Number.isFinite(nlng)) return null;
		return { lat: nlat, lng: nlng } as const; // plain literal
	}, [lat, lng]);

	if (!key) {
		return <Error message="Missing GOOGLE_MAPS_API_KEY." />;
	}
	if (!center) return <Error message="Invalid coordinates." />;
	return (
		<APIProvider apiKey={key}>
			<div className={styles.map}>
				<Map defaultZoom={10} defaultCenter={center}>
					<Marker position={center} />
				</Map>
			</div>
		</APIProvider>
	);
}
