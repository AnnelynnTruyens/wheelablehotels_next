"use client";

import NoResults from "../NoResults";
import styles from "./cards.module.css";

type RoomCardProps = {
	roomName: string;
	roomDescription: string;
	accessibilityFeatures: { _id: string; name: string }[];
	accessibilityInfo: string;
};

export default function RoomCard({
	roomName,
	accessibilityFeatures,
	roomDescription,
	accessibilityInfo,
}: RoomCardProps) {
	return (
		<div className={styles.room}>
			<h3 className={styles.room_title}>{roomName}</h3>
			<h4 className={styles.room_subtitle}>Description</h4>
			<p className={styles.room_text}>{roomDescription}</p>
			<h4 className={styles.room_subtitle}>Accessibility features</h4>
			{accessibilityFeatures && accessibilityFeatures.length > 0 ? (
				<ul className={styles.room_list}>
					{accessibilityFeatures.map((feature, index) => {
						return (
							<li key={`feature_${index}`} className={styles.list_li}>
								{feature.name}
							</li>
						);
					})}
				</ul>
			) : (
				<NoResults insert="accessibility features" />
			)}
			<h4 className={styles.subtitle}>Accessibility information</h4>
			<p className={styles.text}>{accessibilityInfo}</p>
		</div>
	);
}
