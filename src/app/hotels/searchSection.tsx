"use client";

import SearchForm from "@/components/forms/searchForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchSection() {
	const [searchValue, setSearchValue] = useState("");
	const router = useRouter();

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const query = searchValue.trim();
		if (query) {
			router.push(`/hotels?search=${encodeURIComponent(query)}`);
		} else {
			router.push("/hotels");
		}
	};

	return (
		<SearchForm
			searchValue={searchValue}
			onSearchChange={setSearchValue}
			onSearchSubmit={handleSearchSubmit}
		/>
	);
}
