"use client";

import styles from "../admin.module.css";
import DeleteButton from "@/components/buttons/DeleteBtn";
import SecondaryLinkBtn from "@/components/buttons/SecondaryLinkBtn";

type MessageLineProps = {
	messageId: string;
	message: string;
	hotelName?: string;
	status: string;
	userName: string;
};

export default function MessageLine({
	messageId,
	message,
	hotelName,
	status,
	userName,
}: MessageLineProps) {
	const deleteMessage = (messageId: string) => {
		console.log("message to delete: " + messageId);
	};

	return (
		<tr className={styles.table_row}>
			<td>{userName}</td>
			<td>{message}</td>
			<td>{hotelName ? hotelName : null}</td>
			<td>{status}</td>
			<td className={styles.actions}>
				<SecondaryLinkBtn link={`/admin-has-the-power/messages/${messageId}`}>
					View
				</SecondaryLinkBtn>
				<DeleteButton
					action={() => {
						deleteMessage(messageId);
					}}
				/>
			</td>
		</tr>
	);
}
