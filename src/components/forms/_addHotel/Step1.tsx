"use client";
import styles from "../forms.module.css";
import Progress from "./_partials/Progress";
import FormInput from "../_partials/FormInput";
import Link from "next/link";
import { createHotel } from "@/lib/services/hotels/createHotel";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import PrimaryBtn from "@/components/buttons/PrimaryBtn";

interface Step1Props {
	onSuccess: (hotelId: string, hotelName: string) => void;
	onError: (message: string) => void;
	errorMessage?: string;
}

const initialState = {
	success: false,
	error: null,
	data: null,
};

export default function Step1({
	onSuccess,
	onError,
	errorMessage,
}: Step1Props) {
	const [formState, formAction] = useActionState(createHotel, initialState);
	const { pending } = useFormStatus();

	// Local state mirrors the 3 fields we submit
	const [hotelName, setHotelName] = useState("");
	const [address, setAddress] = useState("");
	const [lat, setLat] = useState<number>(0);
	const [lng, setLng] = useState<number>(0);

	// Container where we’ll inject Google’s custom element
	const acContainerRef = useRef<HTMLDivElement | null>(null);

	// Wait for Google Maps to be ready, then create & wire the autocomplete element
	useEffect(() => {
		let acEl: HTMLElement | null = null;
		let listener: any;

		const attach = async () => {
			const g = (window as any).google;
			if (!g?.maps?.importLibrary) {
				// Retry shortly until the script from layout is loaded
				setTimeout(attach, 50);
				return;
			}

			// Ensure Places library is loaded (per Google example)
			await g.maps.importLibrary("places");

			// Create the element (per example)
			acEl = new g.maps.places.PlaceAutocompleteElement();

			// Optional: restrict to establishments (hotels are establishments)
			acEl?.setAttribute("types", "establishment");

			// Insert into our container
			if (acContainerRef.current && acEl) {
				acContainerRef.current.innerHTML = ""; // just in case
				acContainerRef.current.appendChild(acEl);
			}

			// Listen for selections (per example: 'gmp-select')
			listener = async (evt: any) => {
				try {
					const place = evt?.placePrediction?.toPlace?.();
					if (!place) return;

					// Ask only for the fields we need
					await place.fetchFields({
						fields: ["displayName", "formattedAddress", "location"],
					});

					const json = place.toJSON?.() ?? {};
					const name = json.displayName ?? "";
					const addr = json.formattedAddress ?? "";

					// location can be LatLng (functions) or LatLngLiteral (numbers)
					const loc = json.location;
					let lat = 0;
					let lng = 0;
					if (loc) {
						lat =
							typeof loc.lat === "function" ? loc.lat() : (loc.lat as number);
						lng =
							typeof loc.lng === "function" ? loc.lng() : (loc.lng as number);
					}

					// Update form fields
					if (name) setHotelName(name);
					setAddress(addr);
					setLat(lat);
					setLng(lng);
				} catch (e) {
					console.error("Failed to fetch place fields", e);
				}
			};

			acEl?.addEventListener("gmp-select", listener);
		};

		attach();

		return () => {
			try {
				if (acEl && listener) {
					acEl.removeEventListener("gmp-select", listener);
				}
				// Remove element on unmount to be tidy
				if (
					acContainerRef.current &&
					acEl &&
					acEl.parentNode === acContainerRef.current
				) {
					acContainerRef.current.removeChild(acEl);
				}
			} catch {}
		};
	}, []);

	useEffect(() => {
		if (formState.success && formState.data) {
			onSuccess(formState.data._id, formState.data.name);
		}
		if (formState.error) {
			onError(formState.error);
		}
	}, [formState, onSuccess, onError]);

	return (
		<div className={styles.container_full}>
			<Progress step={1} />
			<h1 className={styles.title}>Add hotel</h1>
			<form className={styles.form} action={formAction}>
				<label className={styles.label}>Search hotel</label>
				<div ref={acContainerRef} style={{ marginBottom: 12 }} />

				<p>
					Couldn&apos;t find the hotel you were looking for?{" "}
					<Link href="/contact">Contact us.</Link>
				</p>

				{/* Hidden fields submitted to your server action */}
				<input type="hidden" name="hotelName" value={hotelName} />
				<input type="hidden" name="address" value={address} />
				<input type="hidden" name="lat" value={lat} />
				<input type="hidden" name="lng" value={lng} />

				{errorMessage && <p className={styles.error}>{errorMessage}</p>}
				<div className={styles.buttons}>
					<Link href="/">Cancel</Link>
					<PrimaryBtn type="submit" disabled={pending}>
						{pending ? "Creating hotel..." : "Next"}
					</PrimaryBtn>
				</div>
			</form>
		</div>
	);
}
