"use client";

import { useEffect, useState } from "react";
import styles from "./forms.module.css";
import FormCheckbox from "./_partials/FormCheckbox";
import {
	getAmenities,
	SerializableAmenity,
} from "@/lib/services/amenities/getAmenities";
import {
	getAccessibilityFeatures,
	SerializableAccessibilityFeature,
} from "@/lib/services/accessibilityFeatures/getAccessibilityFeatures";

interface Props {
	formData: {
		amenities: string[];
		accessibilityFeatures: string[];
	};
	onFilterChange: (formData: Props["formData"]) => void;
}

export default function FilterForm({ formData, onFilterChange }: Props) {
	const [amenities, setAmenities] = useState<SerializableAmenity[]>([]);
	const [accessibilityFeatures, setAccessibilityFeatures] = useState<
		SerializableAccessibilityFeature[]
	>([]);

	useEffect(() => {
		getAmenities().then((res) => setAmenities(res));
		getAccessibilityFeatures().then((res) => setAccessibilityFeatures(res));
	}, []);

	const handleChange = (
		type: "amenities" | "accessibilityFeatures",
		value: string,
		checked: boolean
	) => {
		const updated = checked
			? [...formData[type], value]
			: formData[type].filter((id) => id !== value);

		onFilterChange({
			...formData,
			[type]: updated,
		});
	};

	return (
		<div className={styles.filter_form}>
			<h2 className={styles.title_small}>Filters</h2>
			<div className={styles.fieldset_flex}>
				<fieldset className={styles.fieldset}>
					<legend className={styles.fieldset_legend}>
						Accessibility features:
					</legend>
					<div className={styles.checkboxes}>
						{accessibilityFeatures.map((f: any) => (
							<FormCheckbox
								key={f._id}
								label={f.name}
								id={f._id}
								name="accessibilityFeatures"
								value={f._id}
								onChange={(e) =>
									handleChange(
										"accessibilityFeatures",
										e.target.value,
										e.target.checked
									)
								}
							/>
						))}
					</div>
				</fieldset>
				<fieldset className={styles.fieldset}>
					<legend className={styles.fieldset_legend}>General amenities:</legend>
					<div className={styles.checkboxes}>
						{amenities.map((a: any) => (
							<FormCheckbox
								key={a._id}
								label={a.name}
								id={a._id}
								name="amenities"
								value={a._id}
								onChange={(e) =>
									handleChange("amenities", e.target.value, e.target.checked)
								}
							/>
						))}
					</div>
				</fieldset>
			</div>
		</div>
	);
}
