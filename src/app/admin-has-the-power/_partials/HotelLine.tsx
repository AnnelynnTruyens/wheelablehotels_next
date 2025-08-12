"use client";

import styles from "../admin.module.css";
import DeleteButton from "@/components/buttons/DeleteBtn";
import SecondaryLinkBtn from "@/components/buttons/SecondaryLinkBtn";
import { deleteHotel } from "@/lib/services/hotels/deleteHotel";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

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
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleDeleteHotel = async (hotelId: string) => {
		await deleteHotel(hotelId);
		startTransition(() => {
			router.refresh();
		});
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
						handleDeleteHotel(hotelId);
					}}
				/>
			</td>
		</tr>
	);
}
