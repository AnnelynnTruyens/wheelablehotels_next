"use client";

import { useEffect, useState } from "react";
import styles from "../../forms.module.css";
import { AccessibilityFeature } from "@/lib/services/accessibilityFeatures/types";
import { getAccessibilityFeatures } from "@/lib/services/accessibilityFeatures/getAccessibilityFeatures";
import FormInput from "../../_partials/FormInput";
import FormTextarea from "../../_partials/FormTextarea";
import FormCheckbox from "../../_partials/FormCheckbox";

interface AddRoomProps {
	roomId: string | number;
	onDataChange: (data: {
		name: string;
		description: string;
		accessibilityInfo: string;
		accessibilityFeatures: string[]; // ⬅️ Now just _ids
	}) => void;
	initialData?: {
		name?: string;
		description?: string;
		accessibilityInfo?: string;
		accessibilityFeatures?: AccessibilityFeature[];
	};
}

export default function AddRoom({
	roomId,
	onDataChange,
	initialData,
}: AddRoomProps) {
	const [formData, setFormData] = useState({
		name: initialData?.name || "",
		description: initialData?.description || "",
		accessibilityInfo: initialData?.accessibilityInfo || "",
		accessibilityFeatures:
			initialData?.accessibilityFeatures?.map((f) => f._id) || ([] as string[]),
	});

	const [availableFeatures, setAvailableFeatures] = useState<
		AccessibilityFeature[]
	>([]);

	useEffect(() => {
		async function fetchFeatures() {
			const accessibilityFeatures = await getAccessibilityFeatures();
			setAvailableFeatures(accessibilityFeatures);
		}
		fetchFeatures();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const updated = {
			...formData,
			[e.target.name]: e.target.value,
		};
		setFormData(updated);
		onDataChange(updated); // ✅ Notify parent
	};

	const handleFeatureToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		const updatedFeatures = checked
			? [...formData.accessibilityFeatures, value]
			: formData.accessibilityFeatures.filter((id) => id !== value);

		const updated = {
			...formData,
			accessibilityFeatures: updatedFeatures,
		};
		setFormData(updated);
		onDataChange(updated); // ✅ Notify parent
	};

	return (
		<div className={styles.room}>
			<FormInput
				label="Name room"
				type="text"
				id={`room-name-${roomId}`}
				name="name"
				value={formData.name}
				placeholder="Accessible room"
				onChange={handleChange}
				required
			/>

			<FormTextarea
				label="Description"
				id={`room-description-${roomId}`}
				name="description"
				value={formData.description}
				placeholder="Add the description of the room here. Include amenities the room has such as a hair dryer or kettle."
				onChange={handleChange}
			/>

			<fieldset className={styles.fieldset}>
				<legend className={styles.fieldset_legend}>
					Accessibility features:
				</legend>
				<div className={styles.checkboxes}>
					{availableFeatures.map((feature) => (
						<FormCheckbox
							key={feature._id}
							label={feature.name}
							id={`room-${roomId}-feature-${feature._id}`}
							name="accessibilityFeatures"
							value={feature._id}
							checked={formData.accessibilityFeatures.includes(feature._id)}
							onChange={handleFeatureToggle}
						/>
					))}
				</div>
			</fieldset>

			<FormTextarea
				label="Accessibility info"
				id={`room-accessibility-info-${roomId}`}
				name="accessibilityInfo"
				value={formData.accessibilityInfo}
				placeholder="Add accessibility information of the room here. Include a general impression and any additional features."
				onChange={handleChange}
			/>
		</div>
	);
}
