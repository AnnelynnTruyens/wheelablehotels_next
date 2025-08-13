"use client";

import { useActionState, useEffect, useState } from "react";
import styles from "../forms.module.css";
import Progress from "./_partials/Progress";
import { createRoom } from "@/lib/services/rooms/createRoom";
import AddRoom from "./_partials/AddRoom";
import { useFormStatus } from "react-dom";
import SecondaryBtn from "@/components/buttons/SecondaryBtn";
import PrimaryBtn from "@/components/buttons/PrimaryBtn";
import { RoomInfo } from "@/lib/services/rooms/types";
import { getRoomsByHotel } from "@/lib/services/rooms/getRoomsByHotel";
import { getAccessibilityFeatures } from "@/lib/services/accessibilityFeatures/getAccessibilityFeatures";
import { AccessibilityFeature } from "@/lib/services/accessibilityFeatures/types";
import { deleteRoom } from "@/lib/services/rooms/deleteRoom";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { updateRoom } from "@/lib/services/rooms/updateRoom";

interface Step3Props {
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

export default function Step3({
	hotelId,
	hotelName,
	onSuccess,
	onError,
	errorMessage,
	goToPrevious,
}: Step3Props) {
	const [roomDataList, setRoomDataList] = useState<RoomInfo[]>([]);
	const [accessibilityFeatures, setAccessibilityFeatures] = useState<
		AccessibilityFeature[]
	>([]);
	// const { pending } = useFormStatus();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState<boolean>(false);

	// const [formState, formAction] = useActionState(
	// 	async (_prevState: any, formData: FormData) => {
	// 		try {
	// 			if (roomDataList.length === 0) {
	// 				throw new Error("No rooms provided");
	// 			}

	// 			for (const room of roomDataList) {
	// 				const formData = new FormData();
	// 				formData.append("hotelId", hotelId);
	// 				formData.append("name", room.name);
	// 				formData.append("description", room.description);
	// 				formData.append("accessibilityInfo", room.accessibilityInfo);

	// 				(room.accessibilityFeatures || []).forEach((id: string) => {
	// 					formData.append("accessibilityFeatures[]", id);
	// 				});

	// 				await createRoom(formData); // ⬅️ Can make this concurrent if needed
	// 			}

	// 			onSuccess(); // ✅ After all rooms submitted
	// 			return { success: true, error: null };
	// 		} catch (err: any) {
	// 			onError(err.message || "Failed to create room");
	// 			return {
	// 				success: false,
	// 				error: err.message || "Failed to create room",
	// 			};
	// 		}
	// 	},
	// 	initialState
	// );

	useEffect(() => {
		async function fetchData() {
			try {
				const [rooms, features] = await Promise.all([
					getRoomsByHotel(hotelId),
					getAccessibilityFeatures(),
				]);

				setAccessibilityFeatures(features);

				if (rooms.length === 0) {
					const tempId = `temp-${crypto.randomUUID()}`;
					setRoomDataList([
						{
							_id: tempId,
							name: "",
							description: "",
							accessibilityInfo: "",
							hotelId: hotelId,
							accessibilityFeatures: [],
						},
					]);
				} else {
					setRoomDataList(rooms);
				}

				setIsLoading(false);
			} catch (err: any) {
				setError(err.message || "Failed to load hotel data");
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setPending(true);
		try {
			// Update or create rooms
			await Promise.all(
				roomDataList.map((room) => {
					const roomData = new FormData();
					roomData.append("hotelId", hotelId);
					roomData.append("name", room.name);
					roomData.append("description", room.description || "");
					roomData.append("accessibilityInfo", room.accessibilityInfo || "");
					room.accessibilityFeatures?.forEach((feature) => {
						roomData.append("accessibilityFeatures[]", feature._id);
					});

					if (!room._id) return;
					return room._id?.startsWith("temp")
						? createRoom(roomData)
						: updateRoom(null, roomData, room._id);
				})
			);

			onSuccess();
			setPending(false);
		} catch (err: any) {
			console.error("Failed to submit add rooms form:", err);
			onError(err.message || "Submission failed");
			setPending(false);
		}
	};

	if (isLoading) {
		return (
			<div className={styles.container_full}>
				<Progress step={3} />
				<Loading />
			</div>
		);
	} else if (error) {
		if (isLoading) {
			return (
				<div className={styles.container_full}>
					<Progress step={3} />
					<Error message={error} />
				</div>
			);
		}
	} else
		return (
			<div className={styles.container_full}>
				<Progress step={3} />
				<h1 className={styles.title}>Add rooms</h1>
				<p>Please only add accessible rooms.</p>

				<form className={styles.form} onSubmit={handleSubmit}>
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

					<PrimaryBtn type="button" onClick={handleAddRoom}>
						Add another room
					</PrimaryBtn>

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
