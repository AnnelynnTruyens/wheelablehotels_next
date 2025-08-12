"use client";

import styles from "../../admin.module.css";
import DeleteButton from "@/components/buttons/DeleteBtn";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteMessage } from "@/lib/services/messages/deleteMessage";
import SecondaryLinkBtn from "@/components/buttons/SecondaryLinkBtn";

interface MessageDetailProps {
	messageId: string;
	userName: string;
	hotelName?: string;
	email: string;
	message: string;
	status: string;
}

export default function MessageDetail({
	messageId,
	userName,
	hotelName,
	email,
	message,
	status,
}: MessageDetailProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleDeleteMessage = async (messageId: string) => {
		await deleteMessage(messageId);
		startTransition(() => {
			router.push("/admin-has-the-power/messages");
		});
	};
	return (
		<main id="main" className="admin-main">
			<h1>Message from {userName}</h1>
			{hotelName ? <p>Hotel: {hotelName}</p> : null}
			<p>Email: {email}</p>
			<p>Message: {message}</p>
			<div className={styles.buttons}>
				<SecondaryLinkBtn link={`mailto:${email}`}>Answer</SecondaryLinkBtn>
				<DeleteButton action={() => handleDeleteMessage(messageId)} />
			</div>
		</main>
	);
}
