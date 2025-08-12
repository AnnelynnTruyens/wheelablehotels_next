"use client";

import { useEffect, useState } from "react";
import styles from "../forms.module.css";
import { RoomInfo } from "@/lib/services/rooms/types";
import { ImageInfo } from "@/lib/services/images/types";
import { Amenity } from "@/lib/services/amenities/types";
import { AccessibilityFeature } from "@/lib/services/accessibilityFeatures/types";
import { getHotelById } from "@/lib/services/hotels/getHotelById";
import { getRoomsByHotel } from "@/lib/services/rooms/getRoomsByHotel";
import { getImagesByHotel } from "@/lib/services/images/getImagesByHotel";
import { getAmenities } from "@/lib/services/amenities/getAmenities";
import { getAccessibilityFeatures } from "@/lib/services/accessibilityFeatures/getAccessibilityFeatures";
import { deleteRoom } from "@/lib/services/rooms/deleteRoom";
import { deleteImage } from "@/lib/services/images/deleteImage";
import { updateHotel } from "@/lib/services/hotels/updateHotel";
import { createRoom } from "@/lib/services/rooms/createRoom";
import { updateRoom } from "@/lib/services/rooms/updateRoom";
import { createImage } from "@/lib/services/images/createImage";
import Progress from "./_partials/Progress";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import FormInput from "../_partials/FormInput";
import FormCheckbox from "../_partials/FormCheckbox";
import FormTextarea from "../_partials/FormTextarea";
import AddRoom from "./_partials/AddRoom";
import FormFileInput from "../_partials/FormFileInput";
import Link from "next/link";
import { getCurrentUser } from "@/lib/services/users/getCurrentUser";
import { getCurrentUserInfo } from "@/lib/services/users/getCurrentUserInfo";

interface Step5Props {
	hotelId: string;
	onSuccess: () => void;
	onError: (msg: string) => void;
	goToPrevious: () => void;
	editHotel: boolean;
}

export default function Step5({
	hotelId,
	onSuccess,
	onError,
	goToPrevious,
	editHotel,
}: Step5Props) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [hotelData, setHotelData] = useState<any>({});
	const [roomDataList, setRoomDataList] = useState<RoomInfo[]>([]);
	const [hotelImages, setHotelImages] = useState<ImageInfo[]>([]);
	const [amenities, setAmenities] = useState<Amenity[]>([]);
	const [accessibilityFeatures, setAccessibilityFeatures] = useState<
		AccessibilityFeature[]
	>([]);
	const [hotelFiles, setHotelFiles] = useState<FileList | null>(null);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	useEffect(() => {
		async function fetchData() {
			try {
				const [hotel, rooms, images, amenitiesData, features, user] =
					await Promise.all([
						getHotelById(hotelId),
						getRoomsByHotel(hotelId),
						getImagesByHotel(hotelId),
						getAmenities(),
						getAccessibilityFeatures(),
						getCurrentUserInfo(),
					]);

				setHotelData(hotel);
				setRoomDataList(rooms);
				setHotelImages(images);
				setAmenities(amenitiesData);
				setAccessibilityFeatures(features);
				if (user.role === "admin") {
					setIsAdmin(true);
				}
				setIsLoading(false);
			} catch (err: any) {
				setError(err.message || "Failed to load hotel data");
				setIsLoading(false);
			}
		}

		fetchData();
	}, [hotelId]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const target = e.target;
		const { name, value } = target;

		const fieldMapping: Record<string, string> = {
			hotelName: "name",
			location: "location",
			contactEmail: "contactEmail",
			contactPhone: "contactPhone",
			website: "website",
			accessibilityInfo: "accessibilityInfo",
		};

		const mappedName = fieldMapping[name] || name;

		setHotelData({
			...hotelData,
			[mappedName]: value,
		});
	};

	const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		const selectedAmenity = amenities.find((a) => a._id === value);
		if (!selectedAmenity) return;

		const currentList: Amenity[] = hotelData.amenities || [];

		setHotelData({
			...hotelData,
			amenities: checked
				? [...currentList, selectedAmenity]
				: currentList.filter((a) => a._id !== selectedAmenity._id),
		});
	};

	const handleAccessibilityFeatureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { value, checked } = e.target;
		const selectedFeature = accessibilityFeatures.find((f) => f._id === value);
		if (!selectedFeature) return;

		const currentList: AccessibilityFeature[] =
			hotelData.accessibilityFeatures || [];

		setHotelData({
			...hotelData,
			accessibilityFeatures: checked
				? [...currentList, selectedFeature]
				: currentList.filter((f) => f._id !== selectedFeature._id),
		});
	};

	const handleRoomDataChange = (
		roomId: string,
		updatedData: Partial<RoomInfo>
	) => {
		setRoomDataList((prev) =>
			prev.map((room) =>
				room._id === roomId ? { ...room, ...updatedData } : room
			)
		);
	};

	const handleDeleteRoom = async (roomId: string) => {
		const isTemp = roomId.startsWith("temp");
		if (isTemp) {
			setRoomDataList((prev) => prev.filter((room) => room._id !== roomId));
			return;
		}

		try {
			await deleteRoom(roomId);
			setRoomDataList((prev) => prev.filter((room) => room._id !== roomId));
		} catch (err) {
			console.error("Failed to delete room:", err);
		}
	};

	const handleAddRoom = () => {
		const tempId = `temp-${crypto.randomUUID()}`;
		setRoomDataList((prev) => [
			...prev,
			{
				_id: tempId,
				name: "",
				description: "",
				accessibilityInfo: "",
				hotelId,
				accessibilityFeatures: [],
			},
		]);
	};

	const handleHotelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setHotelFiles(e.target.files);
		}
	};

	const handleDeleteImage = async (imageId: string) => {
		try {
			await deleteImage(imageId);
			setHotelImages((prev) => prev.filter((img) => img._id !== imageId));
		} catch (err) {
			console.error("Failed to delete image:", err);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const formData = new FormData(e.target as HTMLFormElement);

			// Update hotel
			await updateHotel(null, formData, hotelId);

			// Update or create rooms
			await Promise.all(
				roomDataList.map((room) => {
					const roomData = new FormData();
					roomData.append("hotelId", hotelId);
					roomData.append("name", room.name);
					roomData.append("description", room.description || "");
					roomData.append("accessibilityInfo", room.accessibilityInfo || "");
					room.accessibilityFeatures?.forEach((feature) => {
						formData.append("accessibilityFeatures[]", feature._id);
					});

					if (!room._id) return;
					return room._id?.startsWith("temp")
						? createRoom(roomData)
						: updateRoom(null, roomData, room._id);
				})
			);

			// Upload new images
			if (hotelFiles) {
				for (const file of Array.from(hotelFiles)) {
					const form = new FormData();
					form.append("file", file);
					const uploadRes = await fetch("/api/upload", {
						method: "POST",
						body: form,
					});
					const { filename } = await uploadRes.json();

					await createImage({
						hotelId,
						name: file.name,
						alt: file.name,
						filename: `/uploads/${filename}`,
					});
				}
			}

			onSuccess();
		} catch (err: any) {
			console.error("Failed to submit hotel overview form:", err);
			onError(err.message || "Submission failed");
		}
	};

	if (isLoading) {
		return (
			<div className={styles.container_full}>
				<Progress step={5} />
				<Loading />
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.container_full}>
				<Progress step={5} />
				<Error message={error} />
			</div>
		);
	}

	return (
		<div className={styles.container_full}>
			{editHotel ? null : <Progress step={5} />}
			<h1 className={styles.title}>{editHotel ? "Edit hotel" : "Overview"}</h1>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h2 className={styles.subtitle}>General info</h2>
				<FormInput
					label="Name hotel"
					type="text"
					id="hotelName"
					name="hotelName"
					value={hotelData.name}
					placeholder="Brussels Plaza Hotel"
					onChange={handleInputChange}
					required
				/>
				<FormInput
					label="Address hotel"
					type="text"
					id="location"
					name="location"
					value={hotelData.location}
					placeholder="Plaza 1, 1000 Brussels"
					onChange={handleInputChange}
					required
				/>
				<FormInput
					label="Email hotel"
					type="email"
					id="contactEmail"
					name="contactEmail"
					value={hotelData.contactEmail}
					placeholder="example@hotel.com"
					onChange={handleInputChange}
					required
				/>
				<FormInput
					label="Phone number hotel"
					type="tel"
					id="contactPhone"
					name="contactPhone"
					value={hotelData.contactPhone}
					placeholder="+32 000 00 00"
					onChange={handleInputChange}
					required
				/>
				<FormInput
					label="Website hotel"
					type="text"
					id="website"
					name="website"
					value={hotelData.website}
					placeholder="www.hotel.com"
					onChange={handleInputChange}
					required
				/>

				<fieldset className={styles.fieldset}>
					<legend className={styles.fieldset_legend}>General amenities:</legend>
					<div className={styles.checkboxes}>
						{amenities.map((amenity) => (
							<FormCheckbox
								key={amenity._id}
								label={amenity.name}
								id={amenity._id}
								name="amenities"
								value={amenity._id}
								checked={hotelData.amenities?.some(
									(a: any) => a._id === amenity._id
								)}
								onChange={handleAmenityChange}
							/>
						))}
					</div>
				</fieldset>

				<h2 className={styles.subtitle}>Accessibility info</h2>
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
								checked={hotelData.accessibilityFeatures?.some(
									(f: any) => f._id === feature._id
								)}
								onChange={handleAccessibilityFeatureChange}
							/>
						))}
					</div>
				</fieldset>

				<FormTextarea
					label="Accessibility info"
					id="accessibilityInfo"
					name="accessibilityInfo"
					value={hotelData.accessibilityInfo}
					placeholder="Add accessibility information..."
					onChange={handleInputChange}
					required
				/>

				<h2 className={styles.subtitle}>Rooms</h2>
				{roomDataList.map((room) => (
					<div key={room._id} className={styles.room_container}>
						<AddRoom
							initialData={room}
							roomId={room._id}
							onDataChange={(data) =>
								handleRoomDataChange(room._id, {
									...data,
									accessibilityFeatures: accessibilityFeatures.filter((f) =>
										data.accessibilityFeatures.includes(f._id)
									),
								})
							}
						/>
						<button
							type="button"
							className={styles.delete_btn}
							onClick={() => handleDeleteRoom(room._id)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
				))}

				<button type="button" onClick={handleAddRoom}>
					Add another room
				</button>

				<h2 className={styles.subtitle}>Photos</h2>
				<FormFileInput
					label="General"
					id="hotelImages"
					name=""
					onChange={handleHotelFileChange}
				/>
				<div>
					<p>Added photos:</p>
					<div className={styles.image_grid}>
						{hotelImages.map((image) => (
							<div key={image._id} className={styles.image_item}>
								<img src={image.imageUrl} alt={image.alt} />
								<button
									type="button"
									onClick={() => handleDeleteImage(image._id)}
									className={styles.delete_btn}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
				</div>

				{isAdmin ? (
					<div className={styles.select}>
						<label className={styles.select_label} htmlFor="status">
							Status
						</label>
						<select
							name="status"
							id="status"
							value={hotelData.status || "new"} // fallback to "new" if undefined
							onChange={handleInputChange}
							className={styles.select_select}
						>
							<option value="new" className={styles.select_option}>
								new
							</option>
							<option value="completed" className={styles.select_option}>
								completed
							</option>
							<option value="published" className={styles.select_option}>
								published
							</option>
							<option value="unpublished" className={styles.select_option}>
								unpublished
							</option>
						</select>
					</div>
				) : (
					<input type="hidden" name="status" value="completed" />
				)}

				<div className={styles.buttons}>
					{editHotel ? (
						<Link href="/">Cancel</Link>
					) : (
						<button type="button" onClick={goToPrevious}>
							Previous
						</button>
					)}

					<button type="submit">Submit</button>
				</div>
			</form>
		</div>
	);
}
