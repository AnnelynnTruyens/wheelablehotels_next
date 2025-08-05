"use client";

import { useActionState, useState } from "react";
import styles from "../forms.module.css";
import Progress from "./_partials/Progress";
import { createRoom } from "@/lib/services/rooms/createRoom";
import AddRoom from "./_partials/AddRoom";

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
	const [roomIds, setRoomIds] = useState<number[]>([0]);
	const [roomDataList, setRoomDataList] = useState<any[]>([]);

	const [formState, formAction] = useActionState(
		async (_prevState: any, formData: FormData) => {
			try {
				if (roomDataList.length === 0) {
					throw new Error("No rooms provided");
				}

				for (const room of roomDataList) {
					const formData = new FormData();
					formData.append("hotelId", hotelId);
					formData.append("name", room.name);
					formData.append("description", room.description || "");
					formData.append("accessibilityInfo", room.accessibilityInfo || "");

					(room.accessibilityFeatures || []).forEach((id: string) => {
						formData.append("accessibilityFeatures[]", id);
					});

					await createRoom(formData); // ⬅️ Can make this concurrent if needed
				}

				onSuccess(); // ✅ After all rooms submitted
				return { success: true, error: null };
			} catch (err: any) {
				onError(err.message || "Failed to create room");
				return {
					success: false,
					error: err.message || "Failed to create room",
				};
			}
		},
		initialState
	);

	const handleRoomDataChange = (roomId: number, data: any) => {
		setRoomDataList((prev) => {
			const updated = [...prev];
			updated[roomId] = data;
			return updated;
		});
	};

	const addRoom = () => {
		setRoomIds((prev) => [...prev, prev.length]);
	};

	const removeRoom = (roomId: number) => {
		setRoomIds((prev) => prev.filter((id) => id !== roomId));
		setRoomDataList((prev) => prev.filter((_, index) => index !== roomId));
	};

	return (
		<div className={styles.container_full}>
			<Progress step={3} />
			<h1 className={styles.title}>Add rooms</h1>
			<p>Please only add accessible rooms.</p>

			<form className={styles.form} action={formAction}>
				{roomIds.map((roomId) => (
					<div key={roomId} className={styles.room_container}>
						<AddRoom
							onDataChange={(data) => handleRoomDataChange(roomId, data)}
							roomId={roomId}
						/>
						<button
							type="button"
							className={styles.delete_btn}
							onClick={() => removeRoom(roomId)}
						>
							{/* Delete icon */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								aria-label="delete button"
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

				<button type="button" onClick={addRoom}>
					Add another room
				</button>

				{formState.error && (
					<p className={styles.error}>Error: {formState.error}</p>
				)}

				<div className={styles.buttons}>
					<button type="button" onClick={goToPrevious}>
						Previous
					</button>
					<button type="submit">Next</button>
				</div>
			</form>
		</div>
	);
}
