"use client";

import styles from "../forms.module.css";

type FormTextareaProps = {
	label: string;
	id: string;
	name: string;
	value?: string;
	placeholder?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	required?: boolean;
	autocomplete?: string;
};

export default function FormTextarea({
	label,
	id,
	name,
	value,
	placeholder,
	onChange,
	required = false,
	autocomplete,
}: FormTextareaProps) {
	return (
		<div className={styles.form_input}>
			<label className={styles.label} htmlFor={id}>
				{label} {required ? "*" : null}
			</label>
			<textarea
				className={styles.input_textarea}
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
