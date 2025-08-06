"use client";

import { useState } from "react";
import FormFileInput from "../_partials/FormFileInput";
import styles from "../forms.module.css";
import Progress from "./_partials/Progress";
import { createImage } from "@/lib/services/images/createImage";

interface Step4Props {
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

export default function Step4({
	hotelId,
	hotelName,
	onSuccess,
	onError,
	errorMessage,
	goToPrevious,
}: Step4Props) {
	const [files, setFiles] = useState<FileList | null>(null);
	const [loading, setLoading] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(e.target.files);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!files || files.length === 0) {
			onError("Please select at least one file");
			return;
		}

		try {
			setLoading(true);

			for (const file of Array.from(files)) {
				// Upload image file to /api/upload
				const uploadForm = new FormData();
				uploadForm.append("file", file);

				const uploadRes = await fetch("/api/upload", {
					method: "POST",
					body: uploadForm,
				});

				if (!uploadRes.ok) {
					throw new Error("Upload failed");
				}

				const { filename } = await uploadRes.json();

				await createImage({
					hotelId,
					name: file.name,
					alt: file.name,
					filename: `/uploads/${filename}`,
				});
			}

			onSuccess();
		} catch (err) {
			console.error(err);
			onError("Something went wrong during file upload");
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className={styles.container_full}>
			<Progress step={4} />
			<h1 className={styles.title}>Add photos</h1>
			<form method="post" className={styles.form} onSubmit={handleSubmit}>
				<FormFileInput
					label="General"
					id="hotelImages"
					name="hotelImages"
					onChange={handleFileChange}
				/>
				{errorMessage && <p className={styles.error}>{errorMessage}</p>}
				<div className={styles.buttons}>
					<button onClick={goToPrevious}>Previous</button>
					<button type="submit" disabled={loading}>
						Next
					</button>
				</div>
			</form>
		</div>
	);
}
