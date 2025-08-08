import Link from "next/link";
import styles from "./cards.module.css";

type MessageCardProps = {
	messageId: string;
	name: string;
	message: string;
};

export default function MessageAdminCard({
	messageId,
	name,
	message,
}: MessageCardProps) {
	return (
		<div className={styles.hotel_card}>
			<div className={styles.card_info}>
				<div className={styles.card_info_left}>
					<Link
						href={{
							pathname: `/admin-has-the-power/messages/${messageId}`,
						}}
						className={styles.card_link}
					>
						<h2 className={styles.card_title}>{name}</h2>
					</Link>
					<p className={styles.card_location}>{message}</p>
				</div>
			</div>
		</div>
	);
}
