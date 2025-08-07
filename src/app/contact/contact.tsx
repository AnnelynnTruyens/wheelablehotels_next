"use client";

import { useSearchParams } from "next/navigation";
import styles from "./contact.module.css";
import ContactForm from "./form";
import { useEffect, useState } from "react";

export default function Contact() {
	const searchParams = useSearchParams();

	const hotelName = searchParams?.get("hotelName");

	const [hotelId, setHotelId] = useState<string | undefined>(undefined);

	useEffect(() => {
		const param = searchParams?.get("hotelId");
		setHotelId(param ?? undefined); // force `undefined` instead of `null`
	}, [searchParams]);

	return (
		<main id="main" className="main">
			<title>Contact | Wheelable Hotels</title>
			<h1 className={styles.contact_title}>Contact</h1>
			{hotelName != null ? (
				<p className={styles.contact_text}>Hotel: {hotelName}</p>
			) : null}
			<ContactForm hotelId={hotelId} />
		</main>
	);
}
