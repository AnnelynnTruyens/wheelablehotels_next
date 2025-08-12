import styles from "../../admin.module.css";
import { getMessageById } from "@/lib/services/messages/getMessageById";
import AdminHeader from "../../_partials/Header";
import { MessageInfo } from "@/lib/services/messages/types";
import NoResults from "@/components/NoResults";
import PrimaryLinkBtn from "@/components/buttons/PrimaryLinkBtn";

interface MessageDetailProps {
	params: Promise<{ id: string }>;
}

export default async function MessageDetailPage({
	params,
}: MessageDetailProps) {
	const { id } = await params;

	const message: MessageInfo = await getMessageById(id);

	function deleteMessage(id: string) {
		console.log("message to delete: " + id);
	}

	if (!message) {
		return (
			<>
				<AdminHeader />
				<title>Message detail | Admin Wheelable Hotels</title>
				<main id="main" className="admin-main">
					<NoResults insert="message" />
				</main>
			</>
		);
	}

	return (
		<>
			<AdminHeader />
			<title>Message detail | Admin Wheelable Hotels</title>
			<main id="main" className="admin-main">
				<h1>Message from {message.name}</h1>
				{message.hotelId ? <p>Hotel: {message.hotelName}</p> : null}
				<p>Email: {message.email}</p>
				<p>Message: {message.message}</p>
				<div className={styles.buttons}>
					<PrimaryLinkBtn link={`mailto:${message.email}`}>
						Answer
					</PrimaryLinkBtn>
				</div>
			</main>
		</>
	);
}
