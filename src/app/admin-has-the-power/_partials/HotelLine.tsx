"use client";

import styles from "../admin.module.css";
import DeleteButton from "@/components/buttons/DeleteBtn";
import SecondaryLinkBtn from "@/components/buttons/SecondaryLinkBtn";

type HotelLineProps = {
	hotelId: string;
	hotelName: string;
	hotelLocation?: string;
	status: string;
	username: string;
	hotelSlug: string;
};

export default function HotelLine({
	hotelId,
	hotelName,
	hotelLocation,
	status,
	username,
	hotelSlug,
}: HotelLineProps) {
	const deleteHotel = (hotelId: string) => {
		console.log("hotel to delete: " + hotelId);
	};

	return (
		<tr className={styles.table_row}>
			<td>{hotelName}</td>
			<td>{hotelLocation}</td>
			<td>{status}</td>
			<td>{username}</td>
			<td className={styles.actions}>
				<SecondaryLinkBtn link={`/hotels/${hotelSlug}/edit`}>
					Edit
				</SecondaryLinkBtn>
				<DeleteButton
					action={() => {
						deleteHotel(hotelId);
					}}
				/>
			</td>
		</tr>
	);
}
