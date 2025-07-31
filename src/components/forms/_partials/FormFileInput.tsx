"use client";

import styles from "../forms.module.css";

type FormFileInputProps = {
	label: string;
	id: string;
	name: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
};

export default function FormFileInput({
	label,
	id,
	name,
	onChange,
	required = false,
}: FormFileInputProps) {
	return (
		<div className={styles.form_input}>
			<label className={styles.label} htmlFor={id}>
				{label} {required ? "*" : null}
			</label>
			<input
				className={styles.input}
				id={id}
				type="file"
				name={name}
				onChange={onChange}
				required={required}
				multiple
				accept=".jpg, .jpeg, .png"
			/>
		</div>
	);
}
