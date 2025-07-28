"use client";

import styles from "./forms.module.css";

type FormInputProps = {
	label: string;
	type: string;
	id: string;
	name: string;
	value?: string | number;
	placeholder?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	autocomplete?: string;
};

export default function FormInput({
	label,
	type,
	id,
	name,
	value,
	placeholder,
	onChange,
	required = false,
	autocomplete,
}: FormInputProps) {
	return (
		<div className={styles.form_input}>
			<label className={styles.label} htmlFor={id}>
				{label} {required ? "*" : null}
			</label>
			<input
				className={styles.input}
				type={type}
				id={id}
				name={name}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				required={required}
				autoComplete={autocomplete}
			/>
		</div>
	);
}
