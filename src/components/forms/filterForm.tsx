"use client";

import { useEffect, useRef, useState } from "react";
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

	const [isCompact, setIsCompact] = useState(false);
	const [open, setOpen] = useState(true);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const toggleRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		getAmenities().then((res) => setAmenities(res));
		getAccessibilityFeatures().then((res) => setAccessibilityFeatures(res));
	}, []);

	// keep SSR-safe; only read media queries after mount
	useEffect(() => {
		const mq = window.matchMedia("(max-width: 1000px)");
		const apply = () => {
			setIsCompact(mq.matches);
			// When entering compact mode, start closed; when leaving, force open
			setOpen(mq.matches ? false : true);
		};
		apply();
		// subscribe
		if (mq.addEventListener) {
			mq.addEventListener("change", apply);
		} else {
			mq.addListener(apply);
		}

		// cleanup
		return () => {
			if (mq.removeEventListener) {
				mq.removeEventListener("change", apply);
			} else {
				mq.removeListener(apply);
			}
		};
	}, []);

	// Close on Escape when focus is inside the panel (mobile UX)
	useEffect(() => {
		if (!isCompact || !open) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpen(false);
				// return focus to the toggle for keyboard users
				toggleRef.current?.focus();
			}
		};
		document.addEventListener("keydown", onKeyDown, { capture: true });
		return () =>
			document.removeEventListener("keydown", onKeyDown, { capture: true });
	}, [isCompact, open]);

	// Make the hidden panel non-focusable with `inert` (supported widely now)
	useEffect(() => {
		const panel = panelRef.current;
		if (!panel) return;
		if (isCompact && !open) {
			panel.setAttribute("inert", "");
			panel.hidden = true;
			panel.setAttribute("aria-hidden", "true");
		} else {
			panel.removeAttribute("inert");
			panel.hidden = false;
			panel.removeAttribute("aria-hidden");
		}
	}, [isCompact, open]);

	const handleChange = (
		type: "amenities" | "accessibilityFeatures",
		value: string,
		checked: boolean
	) => {
		const updated = checked
			? [...new Set([...formData[type], value])]
			: formData[type].filter((id) => id !== value);

		onFilterChange({
			...formData,
			[type]: updated,
		});
	};

	const activeCount =
		formData.accessibilityFeatures.length + formData.amenities.length;

	return (
		<div className={styles.filter_form}>
			<div className={styles.filter_header}>
				<h2
					className={`${styles.title_small} ${styles.filter_title}`}
					id="filters-heading"
				>
					Filters
				</h2>

				{isCompact ? (
					<button
						ref={toggleRef}
						type="button"
						className={styles.filter_toggle}
						aria-expanded={open}
						aria-controls="filters-panel"
						aria-label={open ? "close filters" : "open filters"}
						onClick={() => setOpen((v) => !v)}
					>
						<span className={styles.filter_badge} aria-live="polite">
							{activeCount > 0 ? ` (${activeCount})` : ""}
						</span>
						{open ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M18 15L12 9L6 15"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M6 9L12 15L18 9"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}
					</button>
				) : null}
			</div>

			<div
				id="filters-panel"
				ref={panelRef}
				role="region"
				aria-labelledby="filters-heading"
				className={`${styles.filter_panel} ${
					open ? styles.open : styles.closed
				}`}
			>
				<div className={styles.fieldset_flex}>
					<fieldset className={styles.fieldset}>
						<legend className={styles.fieldset_legend}>
							Accessibility features:
						</legend>
						<div className={styles.checkboxes}>
							{accessibilityFeatures.map(
								(f: SerializableAccessibilityFeature) => (
									<FormCheckbox
										key={f._id}
										label={f.name}
										id={f._id}
										name="accessibilityFeatures"
										value={f._id}
										checked={formData.accessibilityFeatures.includes(f._id)}
										onChange={(e) =>
											handleChange(
												"accessibilityFeatures",
												e.target.value,
												e.target.checked
											)
										}
									/>
								)
							)}
						</div>
					</fieldset>
					<fieldset className={styles.fieldset}>
						<legend className={styles.fieldset_legend}>
							General amenities:
						</legend>
						<div className={styles.checkboxes}>
							{amenities.map((a: SerializableAmenity) => (
								<FormCheckbox
									key={a._id}
									label={a.name}
									id={a._id}
									name="amenities"
									value={a._id}
									checked={formData.amenities.includes(a._id)}
									onChange={(e) =>
										handleChange("amenities", e.target.value, e.target.checked)
									}
								/>
							))}
						</div>
					</fieldset>
				</div>
			</div>
		</div>
	);
}
