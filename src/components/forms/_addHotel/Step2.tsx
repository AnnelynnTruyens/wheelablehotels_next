"use client";

import { useActionState, useEffect, useState } from "react";
import styles from "../forms.module.css";
import { updateHotel } from "@/lib/services/hotels/updateHotel";
import { Amenity } from "@/lib/services/amenities/types";
import { AccessibilityFeature } from "@/lib/services/accessibilityFeatures/types";
import Progress from "./_partials/Progress";
import FormInput from "../_partials/FormInput";
import FormCheckbox from "../_partials/FormCheckbox";
import FormTextarea from "../_partials/FormTextarea";
import { getAmenities } from "@/lib/services/amenities/getAmenities";
import { getAccessibilityFeatures } from "@/lib/services/accessibilityFeatures/getAccessibilityFeatures";
import { useFormStatus } from "react-dom";
import SecondaryBtn from "@/components/buttons/SecondaryBtn";
import PrimaryBtn from "@/components/buttons/PrimaryBtn";
import { getHotelById } from "@/lib/services/hotels/getHotelById";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

interface Step2Props {
	hotelId: string;
	hotelName: string;
	onSuccess: () => void;
	onError: (msg: string) => void;
	errorMessage?: string;
	goToPrevious: () => void;
}

const initialState = {
	error: null,
	success: false,
};

export default function Step2({
	hotelId,
	hotelName,
	onSuccess,
	onError,
	errorMessage,
	goToPrevious,
}: Step2Props) {
	const { pending } = useFormStatus();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [hotelData, setHotelData] = useState<any>({});
	const [amenities, setAmenities] = useState<Amenity[]>([]);
	const [accessibilityFeatures, setAccessibilityFeatures] = useState<
		AccessibilityFeature[]
	>([]);

	const [formState, formAction] = useActionState(
		async (_prevState: any, formData: FormData) => {
			try {
				formData.append("status", "new");
				// Append amenities
				formData.delete("amenities[]"); // Avoid duplicates if form re-submitted
				formValue.amenities.forEach((a: Amenity) =>
					formData.append("amenities[]", a._id)
				);

				// Append accessibility features
				formData.delete("accessibilityFeatures[]");
				formValue.accessibilityFeatures.forEach((f: AccessibilityFeature) =>
					formData.append("accessibilityFeatures[]", f._id)
				);
				await updateHotel(_prevState, formData, hotelId);
				return { success: true, error: null };
			} catch (err: any) {
				return {
					success: false,
					error: err.message || "Failed to update hotel",
				};
			}
		},
		initialState
	);

	useEffect(() => {
		async function fetchData() {
			try {
				const [hotel, amenitiesData, features] = await Promise.all([
					getHotelById(hotelId),
					getAmenities(),
					getAccessibilityFeatures(),
				]);

				setHotelData(hotel);
				setAmenities(amenitiesData);
				setAccessibilityFeatures(features);
				setIsLoading(false);
			} catch (err: any) {
				setError(err.message || "Failed to load hotel data");
				setIsLoading(false);
			}
		}

		fetchData();
	}, []);

	useEffect(() => {
		if (formState.success) onSuccess();
		if (formState.error) onError(formState.error);
	}, [formState, onSuccess, onError]);

	const [formValue, setFormValue] = useState({
		hotelName: "",
		address: "",
		lat: 0,
		lng: 0,
		contactEmail: "",
		contactPhone: "",
		website: "",
		accessibilityInfo: "",
		amenities: [] as Amenity[],
		accessibilityFeatures: [] as AccessibilityFeature[],
	});

	useEffect(() => {
		if (
			!hotelData ||
			!hotelData.name ||
			!hotelData.location.lat ||
			!hotelData.location.lng
		)
			return;

		setFormValue({
			hotelName: hotelData.name || "",
			address: hotelData.address || "",
			lat: hotelData.location.lat || 0,
			lng: hotelData.location.lng || 0,
			contactEmail: hotelData.contactEmail || "",
			contactPhone: hotelData.contactPhone || "",
			website: hotelData.website || "",
			accessibilityInfo: hotelData.accessibilityInfo || "",
			amenities: hotelData.amenities || [],
			accessibilityFeatures: hotelData.accessibilityFeatures || [],
		});
	}, [hotelData]);

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setFormValue({ ...formValue, [e.target.name]: e.target.value });
	};

	const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		const selected = amenities.find((a) => a._id === value);
		if (!selected) return;

		setFormValue((prev) => ({
			...prev,
			amenities: checked
				? [...prev.amenities, selected]
				: prev.amenities.filter((a) => a._id !== value),
		}));
	};

	const handleAccessibilityChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { value, checked } = e.target;
		const selected = accessibilityFeatures.find((f) => f._id === value);
		if (!selected) return;

		setFormValue((prev) => ({
			...prev,
			accessibilityFeatures: checked
				? [...prev.accessibilityFeatures, selected]
				: prev.accessibilityFeatures.filter((f) => f._id !== value),
		}));
	};

	if (isLoading) {
		return (
			<div className={styles.container_full}>
				<Progress step={2} />
				<Loading />
			</div>
		);
	} else if (error) {
		if (isLoading) {
			return (
				<div className={styles.container_full}>
					<Progress step={2} />
					<Error message={error} />
				</div>
			);
		}
	} else
		return (
			<div className={styles.container_full}>
				<Progress step={2} />
				<h1 className={styles.title}>Add hotel info</h1>

				<form className={styles.form} action={formAction}>
					<FormInput
						label="Name hotel"
						type="text"
						id="hotelName"
						name="hotelName"
						placeholder="Brussels Plaza Hotel"
						required
						value={formValue.hotelName}
						onChange={handleChange}
					/>
					<FormInput
						label="Address hotel"
						type="text"
						id="address"
						name="address"
						value={formValue.address}
						placeholder="Plaza 1, 1000 Brussels"
						onChange={handleChange}
						required
					/>
					<FormInput
						label="Email hotel"
						type="email"
						id="contactEmail"
						name="contactEmail"
						value={formValue.contactEmail}
						placeholder="example@hotel.com"
						onChange={handleChange}
						required
					/>
					<FormInput
						label="Phone number hotel"
						type="tel"
						id="contactPhone"
						name="contactPhone"
						value={formValue.contactPhone}
						placeholder="+32 000 00 00"
						onChange={handleChange}
						required
					/>
					<FormInput
						label="Website hotel"
						type="text"
						id="website"
						name="website"
						value={formValue.website}
						placeholder="www.hotel.com"
						onChange={handleChange}
						required
					/>

					<fieldset className={styles.fieldset}>
						<legend className={styles.fieldset_legend}>
							General amenities:
						</legend>
						<div className={styles.checkboxes}>
							{amenities.map((amenity) => (
								<FormCheckbox
									key={amenity._id}
									label={amenity.name}
									id={amenity._id}
									name="amenities"
									value={amenity._id}
									checked={formValue.amenities.some(
										(a) => a._id === amenity._id
									)}
									onChange={handleAmenityChange}
								/>
							))}
						</div>
					</fieldset>

					<h2 className={styles.title}>Accessibility info</h2>
					<fieldset className={styles.fieldset}>
						<legend className={styles.fieldset_legend}>
							Accessibility features:
						</legend>
						<div className={styles.checkboxes}>
							{accessibilityFeatures.map((feature) => (
								<FormCheckbox
									key={feature._id}
									label={feature.name}
									id={feature._id}
									name="accessibilityFeatures"
									value={feature._id}
									checked={formValue.accessibilityFeatures.some(
										(f) => f._id === feature._id
									)}
									onChange={handleAccessibilityChange}
								/>
							))}
						</div>
					</fieldset>

					<FormTextarea
						label="Accessibility info"
						id="accessibilityInfo"
						name="accessibilityInfo"
						value={formValue.accessibilityInfo}
						placeholder="Add accessibility information..."
						onChange={handleChange}
						required
					/>

					<input type="hidden" name="lat" value={formValue.lat} />
					<input type="hidden" name="lng" value={formValue.lng} />
					{formState.error && <p className={styles.error}>{formState.error}</p>}

					<div className={styles.buttons}>
						<SecondaryBtn type="button" onClick={goToPrevious}>
							Previous
						</SecondaryBtn>
						<PrimaryBtn type="submit" disabled={pending}>
							Next
						</PrimaryBtn>
					</div>
				</form>
			</div>
		);
}
