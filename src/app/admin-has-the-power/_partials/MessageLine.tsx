"use client";

import styles from "../admin.module.css";
import DeleteButton from "@/components/buttons/DeleteBtn";
import SecondaryLinkBtn from "@/components/buttons/SecondaryLinkBtn";
import { deleteMessage } from "@/lib/services/messages/deleteMessage";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type MessageLineProps = {
	messageId: string;
	message: string;
	hotelName?: string;
	userName: string;
};

export default function MessageLine({
	messageId,
	message,
	hotelName,
	userName,
}: MessageLineProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleDeleteMessage = async (messageId: string) => {
		await deleteMessage(messageId);
		startTransition(() => {
			router.refresh();
		});
	};

	return (
		<tr className={styles.table_row}>
			<td>{userName}</td>
			<td>{message}</td>
			<td>{hotelName ? hotelName : null}</td>
			<td className={styles.actions}>
				<SecondaryLinkBtn link={`/admin-has-the-power/messages/${messageId}`}>
					View
				</SecondaryLinkBtn>
				<DeleteButton
					action={() => {
						handleDeleteMessage(messageId);
					}}
				/>
			</td>
		</tr>
	);
}
