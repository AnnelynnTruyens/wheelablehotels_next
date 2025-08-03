"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../hotels.module.css";
import NoResults from "@/components/NoResults";
import { ImageInfo } from "@/lib/services/images/types";

type Props = {
	images: ImageInfo[];
};

export default function HotelImageGallery({ images }: Props) {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null
	);
	const dialogRef = useRef<HTMLDialogElement>(null);

	const openModal = (index: number) => {
		setSelectedImageIndex(index);
		dialogRef.current?.showModal();
	};

	const closeModal = () => {
		setSelectedImageIndex(null);
		dialogRef.current?.close();
	};

	const showNext = () => {
		if (!images || selectedImageIndex === null) return;
		setSelectedImageIndex((prev) => (prev! + 1) % images.length);
	};

	const showPrev = () => {
		if (!images || selectedImageIndex === null) return;
		setSelectedImageIndex((prev) =>
			prev! === 0 ? images.length - 1 : prev! - 1
		);
	};

	// Keyboard navigation
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (!dialogRef.current?.open) return;

			if (e.key === "Escape") closeModal();
			if (e.key === "ArrowLeft") showPrev();
			if (e.key === "ArrowRight") showNext();
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [selectedImageIndex]);

	return (
		<>
			<div className={styles.images}>
				{images.length ? (
					images.map((img, index) => (
						<img
							key={`image_${img._id}`}
							src={img.imageUrl}
							alt={img.alt || `Hotel image ${index + 1}`}
							className={styles.image}
							onClick={() => openModal(index)}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") openModal(index);
							}}
						/>
					))
				) : (
					<NoResults insert="images" />
				)}
			</div>

			<dialog
				ref={dialogRef}
				aria-modal="true"
				className={styles.imageModal}
				onClick={(e) => {
					if (e.target === dialogRef.current) closeModal();
				}}
			>
				{selectedImageIndex !== null && (
					<div className={styles.modalContent}>
						<button
							onClick={closeModal}
							className={styles.closeButton}
							aria-label="Close image preview"
						>
							&times;
						</button>
						<button
							onClick={showPrev}
							className={styles.navButton}
							aria-label="Previous image"
						>
							←
						</button>
						<img
							src={`${images[selectedImageIndex].imageUrl}`}
							alt={images[selectedImageIndex].alt || "Hotel image"}
							className={styles.modalImage}
						/>
						<button
							onClick={showNext}
							className={styles.navButton}
							aria-label="Next image"
						>
							→
						</button>
					</div>
				)}
			</dialog>
		</>
	);
}
