import { getMessageById } from "@/lib/services/messages/getMessageById";
import AdminHeader from "../../_partials/Header";
import { MessageInfo } from "@/lib/services/messages/types";
import NoResults from "@/components/NoResults";
import MessageDetail from "./MessageDetail";

interface MessageDetailProps {
	params: Promise<{ id: string }>;
}

export default async function MessageDetailPage({
	params,
}: MessageDetailProps) {
	const { id } = await params;

	const message: MessageInfo = await getMessageById(id);

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
			<MessageDetail
				messageId={message._id}
				userName={message.name}
				hotelName={message.hotelName}
				email={message.email}
				message={message.message}
				status={message.status}
			/>
		</>
	);
}
