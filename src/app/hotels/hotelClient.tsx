"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchForm from "@/components/forms/searchForm";
import HotelCard from "@/components/cards/HotelCard";
import NoResults from "@/components/NoResults";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import styles from "./hotels.module.css";
import { HotelWithRatingAndImage } from "@/lib/services/hotels/types";
import FilterForm from "@/components/forms/filterForm";

type HotelClientProps = {
	initialHotels: HotelWithRatingAndImage[];
};

function parseCSV(param: string | null): string[] {
	if (!param) return [];
	return param
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

function buildQuery({
	search,
	amenities,
	accessibilityFeatures,
}: {
	search: string;
	amenities: string[];
	accessibilityFeatures: string[];
}) {
	const params = new URLSearchParams();
	if (search) params.set("search", search);
	if (amenities.length) params.set("amenities", amenities.join(","));
	if (accessibilityFeatures.length)
		params.set("accessibilityFeatures", accessibilityFeatures.join(","));
	const qs = params.toString();
	return qs ? `/hotels?${qs}` : "/hotels";
}

export default function HotelClient({ initialHotels }: HotelClientProps) {
	const searchParams = useSearchParams();
	const router = useRouter();

	// --- 1) seed state from URL ---
	const urlSearchValue = searchParams?.get("search") || "";
	const urlAmenities = useMemo(
		() => parseCSV(searchParams!.get("amenities")),
		[searchParams]
	);
	const urlFeatures = useMemo(
		() => parseCSV(searchParams!.get("accessibilityFeatures")),
		[searchParams]
	);

	const [hotels, setHotels] = useState<HotelWithRatingAndImage[]>(
		initialHotels || []
	);
	const [filteredHotels, setFilteredHotels] = useState<
		HotelWithRatingAndImage[]
	>([]);
	const [searchValue, setSearchValue] = useState(urlSearchValue);
	const [appliedSearchValue, setAppliedSearchValue] = useState(urlSearchValue);
	const [formData, setFormData] = useState({
		amenities: urlAmenities,
		accessibilityFeatures: urlFeatures,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// --- 2) apply filters/search to data ---
	useEffect(() => {
		const query = appliedSearchValue.trim().toLowerCase();

		const results = hotels.filter((hotel) => {
			const nameMatch = hotel.name?.toLowerCase().includes(query);
			const locationMatch = hotel.location?.toLowerCase().includes(query);
			const matchesSearch = query === "" || nameMatch || locationMatch;

			const hotelAmenityIds =
				hotel.amenities?.map((a) => (typeof a === "string" ? a : a._id)) || [];
			const matchesAmenities = formData.amenities.every((id) =>
				hotelAmenityIds.includes(id)
			);

			const hotelFeatureIds =
				hotel.accessibilityFeatures?.map((f) =>
					typeof f === "string" ? f : f._id
				) || [];
			const matchesAccessibility = formData.accessibilityFeatures.every((id) =>
				hotelFeatureIds.includes(id)
			);

			return matchesSearch && matchesAmenities && matchesAccessibility;
		});

		setFilteredHotels(results);
	}, [hotels, appliedSearchValue, formData]);

	// --- 3) keep URL in sync with state (without stacking history) ---
	useEffect(() => {
		const href = buildQuery({
			search: appliedSearchValue,
			amenities: formData.amenities,
			accessibilityFeatures: formData.accessibilityFeatures,
		});
		// Only replace if it differs (prevents unnecessary renders)
		const current = (searchParams?.toString?.() ?? "") || "";
		const next = href.split("?")[1] ?? "";
		if (current !== next) {
			router.replace(href);
		}
	}, [appliedSearchValue, formData, router, searchParams]);

	// --- 4) search submit preserves filters in URL ---
	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = searchValue.trim();
		setAppliedSearchValue(trimmed);
		const href = buildQuery({
			search: trimmed,
			amenities: formData.amenities,
			accessibilityFeatures: formData.accessibilityFeatures,
		});
		router.push(href);
	};

	return (
		<>
			<SearchForm
				searchValue={searchValue}
				onSearchChange={setSearchValue}
				onSearchSubmit={handleSearchSubmit}
			/>

			<h1>Search hotels</h1>
			<div className={styles.content_flex}>
				<FilterForm formData={formData} onFilterChange={setFormData} />

				{isLoading ? (
					<Loading />
				) : error ? (
					<Error message={error.message} />
				) : (
					<div className={styles.hotels}>
						{filteredHotels.length > 0 ? (
							filteredHotels.map((hotel) => (
								<HotelCard
									key={hotel._id}
									hotelId={hotel._id}
									hotelName={hotel.name}
									hotelSlug={hotel.slug}
									location={hotel.location}
									rating={hotel.rating}
									accessibilityFeatures={hotel.accessibilityFeatures}
									imageUrl={hotel.imageUrl}
									imageAlt={hotel.imageAlt}
								/>
							))
						) : (
							<NoResults insert="hotels" />
						)}
					</div>
				)}
			</div>
		</>
	);
}
