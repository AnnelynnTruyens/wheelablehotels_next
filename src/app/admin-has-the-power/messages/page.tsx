import styles from "../admin.module.css";
import AdminHeader from "../_partials/Header";
import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/middleware/auth";
import { redirect } from "next/navigation";
import { UserInfo } from "@/lib/services/users/types";
import { getCurrentUserInfo } from "@/lib/services/users/getCurrentUserInfo";
import { getMessages } from "@/lib/services/messages/getMessages";
import MessageLine from "../_partials/MessageLine";
import NoResults from "@/components/NoResults";

export default async function AdminMessageOverview() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;
	const from = "/admin-has-the-power";

	if (!token || isTokenExpired(token)) {
		redirect(`/users/login?from=${encodeURIComponent(from)}`);
	}

	const user: UserInfo = await getCurrentUserInfo();

	if (user.role !== "admin") {
		redirect("/");
	}

	const messages = await getMessages();

	return (
		<>
			<AdminHeader />
			<main id="main" className="admin-main">
				<h1>Messages</h1>
				<table className={styles.table}>
					<tbody>
						<tr className={styles.table_row}>
							<th className={styles.table_head}>Name</th>
							<th className={styles.table_head}>Message</th>
							<th className={styles.table_head}>Hotel</th>
							<th className={styles.table_head}>Actions</th>
						</tr>

						{messages && messages.length > 0 ? (
							messages.map((message) => {
								return (
									<MessageLine
										key={`message_${message._id}`}
										messageId={message._id}
										message={message.message}
										hotelName={message.hotelName}
										userName={message.name}
									/>
								);
							})
						) : (
							<NoResults insert="messages" />
						)}
					</tbody>
				</table>
			</main>
		</>
	);
}
