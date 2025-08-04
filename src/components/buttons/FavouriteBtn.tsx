"use client";

import { getFavouriteByHotel } from "@/lib/services/favourites/getFavouriteByHotel";
import styles from "./buttons.module.css";
import { useEffect, useState, useTransition } from "react";
import { createFavourite } from "@/lib/services/favourites/createFavourite";
import { deleteFavourite } from "@/lib/services/favourites/deleteFavourite";
import { jwtDecode } from "jwt-decode";

type FavouriteBtnProps = {
	hotelId: string;
};

export default function FavouriteBtn({ hotelId }: FavouriteBtnProps) {
	const [isFavourite, setIsFavourite] = useState(false);
	const [favouriteId, setFavouriteId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	// Fetch favourite status on mount
	useEffect(() => {
		fetchFavourite();
	}, [hotelId]);

	const fetchFavourite = async () => {
		try {
			const favourite = await getFavouriteByHotel(hotelId);
			if (favourite?.hotelId === hotelId) {
				setIsFavourite(true);
				setFavouriteId(favourite._id);
			}
		} catch {
			return;
		}
	};

	const handleAddFavourite = () => {
		startTransition(async () => {
			try {
				if (isFavourite) return;

				const formData = new FormData();
				formData.append("hotelId", hotelId);
				formData.append("from", window.location.pathname);

				const result = await createFavourite(formData);
				if ("redirect" in result) {
					window.location.href = result.redirect as string;
					return;
				}

				if ("error" in result) {
					console.error(result.error);
					return;
				}
				setIsFavourite(true);
				fetchFavourite();
			} catch (error) {
				console.error("Error adding favourite:", error);
			}
		});
	};

	const handleDeleteFavourite = () => {
		if (!favouriteId) return;

		startTransition(async () => {
			try {
				await deleteFavourite(favouriteId);
				setIsFavourite(false);
				setFavouriteId(null);
			} catch (error) {
				console.error("Error removing favourite:", error);
			}
		});
	};

	if (isFavourite) {
		return (
			<button
				type="button"
				className={styles.favourite_btn}
				onClick={handleDeleteFavourite}
				disabled={isPending}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 40 40"
					className={styles.favourite_icon_filled}
				>
					<path
						d="M34.7333 7.68333C33.8821 6.83167 32.8714 6.15608 31.7589 5.69514C30.6465 5.2342 29.4541 4.99696 28.25 4.99696C27.0459 4.99696 25.8535 5.2342 24.7411 5.69514C23.6286 6.15608 22.6179 6.83167 21.7667 7.68333L20 9.45L18.2333 7.68333C16.5138 5.96385 14.1817 4.99785 11.75 4.99785C9.31827 4.99785 6.98615 5.96385 5.26666 7.68333C3.54717 9.40282 2.58118 11.7349 2.58118 14.1667C2.58118 16.5984 3.54717 18.9305 5.26666 20.65L20 35.3833L34.7333 20.65C35.585 19.7987 36.2606 18.788 36.7215 17.6756C37.1825 16.5632 37.4197 15.3708 37.4197 14.1667C37.4197 12.9625 37.1825 11.7702 36.7215 10.6577C36.2606 9.54531 35.585 8.53459 34.7333 7.68333Z"
						strokeWidth="3.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				Added to favourites
			</button>
		);
	} else
		return (
			<button
				type="button"
				className={styles.favourite_btn}
				onClick={handleAddFavourite}
				disabled={isPending}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 40 40"
					className={styles.favourite_icon_empty}
				>
					<path
						d="M34.7333 7.68333C33.8821 6.83167 32.8714 6.15608 31.7589 5.69514C30.6465 5.2342 29.4541 4.99696 28.25 4.99696C27.0459 4.99696 25.8535 5.2342 24.7411 5.69514C23.6286 6.15608 22.6179 6.83167 21.7667 7.68333L20 9.45L18.2333 7.68333C16.5138 5.96385 14.1817 4.99785 11.75 4.99785C9.31827 4.99785 6.98615 5.96385 5.26666 7.68333C3.54717 9.40282 2.58118 11.7349 2.58118 14.1667C2.58118 16.5984 3.54717 18.9305 5.26666 20.65L20 35.3833L34.7333 20.65C35.585 19.7987 36.2606 18.788 36.7215 17.6756C37.1825 16.5632 37.4197 15.3708 37.4197 14.1667C37.4197 12.9625 37.1825 11.7702 36.7215 10.6577C36.2606 9.54531 35.585 8.53459 34.7333 7.68333Z"
						strokeWidth="3.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				Add to favourites
			</button>
		);
}
