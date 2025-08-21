"use client";

import NoResults from "../NoResults";
import styles from "./cards.module.css";

type RoomCardProps = {
	roomName: string;
	roomDescription: string;
	accessibilityFeatures: { _id: string; name: string; icon?: string }[];
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
				<ul className={styles.card_features}>
					{accessibilityFeatures.map((feature) => {
						return (
							<li
								key={`accessibility-feature_${feature._id}`}
								className={styles.card_feature}
							>
								<img src={feature.icon} alt="" className={styles.card_icon} />
								<p className={styles.card_p} key={`feature_${feature._id}`}>
									{feature.name}
								</p>
							</li>
						);
					})}
				</ul>
			) : (
				<NoResults insert="accessibility features" />
			)}
			<h4 className={styles.room_subtitle}>Accessibility information</h4>
			<p className={styles.room_text}>{accessibilityInfo}</p>
		</div>
	);
}
