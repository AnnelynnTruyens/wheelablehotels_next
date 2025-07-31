"use client";

import styles from "./forms.module.css";
import FormInput from "./_partials/FormInput";
import { FormEvent } from "react";

type SearchFormProps = {
	searchValue: string;
	onSearchChange: (value: string) => void;
	onSearchSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function SearchForm({
	searchValue,
	onSearchChange,
	onSearchSubmit,
}: SearchFormProps) {
	return (
		<form className={styles.search_form} onSubmit={onSearchSubmit}>
			<FormInput
				label="search"
				type="search"
				id="search-hotel"
				name="search-hotel"
				placeholder="Search destination or hotel"
				value={searchValue}
				required={false}
				onChange={(e) => onSearchChange(e.target.value)}
			/>
			<button type="submit" className={styles.search_btn}>
				Search
			</button>
		</form>
	);
}
