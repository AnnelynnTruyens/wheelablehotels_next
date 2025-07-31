"use client";

import { useEffect, useState } from "react";
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

export default function HotelClient({ initialHotels }: HotelClientProps) {
	const searchParams = useSearchParams();
	const searchValueFromURL = searchParams.get("search") || "";

	const [hotels, setHotels] = useState<HotelWithRatingAndImage[]>(
		initialHotels || []
	);
	const [filteredHotels, setFilteredHotels] = useState<
		HotelWithRatingAndImage[]
	>([]);
	const [searchValue, setSearchValue] = useState(searchValueFromURL);
	const [appliedSearchValue, setAppliedSearchValue] =
		useState(searchValueFromURL);
	const [formData, setFormData] = useState({
		amenities: [] as string[],
		accessibilityFeatures: [] as string[],
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const router = useRouter();

	useEffect(() => {
		applyFiltersAndSearch();
	}, [hotels, appliedSearchValue, formData]);

	const applyFiltersAndSearch = () => {
		const query = appliedSearchValue.trim().toLowerCase();
		const completedHotels = hotels.filter(
			(hotel) => hotel.status === "completed"
		);

		const results = completedHotels.filter((hotel) => {
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
	};

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = searchValue.trim();
		setAppliedSearchValue(trimmed);
		router.push(
			trimmed ? `/hotels?search=${encodeURIComponent(trimmed)}` : "/hotels"
		);
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
