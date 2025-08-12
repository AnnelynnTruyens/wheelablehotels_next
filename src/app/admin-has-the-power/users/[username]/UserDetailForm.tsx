"use client";

import GoBackBtn from "@/components/buttons/GoBackBtn";
import PrimaryBtn from "@/components/buttons/PrimaryBtn";
import styles from "@/components/forms/forms.module.css";
import { updateUser } from "@/lib/services/users/updateUser";
import { set } from "mongoose";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

interface UserDetailProps {
	initialRole: string;
	userId: string;
}

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<PrimaryBtn type="submit" disabled={pending}>
			Edit
		</PrimaryBtn>
	);
}

export default function UserDetailForm({
	initialRole,
	userId,
}: UserDetailProps) {
	const router = useRouter();
	const [role, setRole] = useState(initialRole);
	const [pending, setPending] = useState<boolean>(false);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newRole = e.target.value;
		setRole(newRole);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setPending(true);
		await updateUser(userId, role);
		router.push("/admin-has-the-power/users");
		setPending(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="role" className={styles.select_label}>
				Role
			</label>
			<select
				name="role"
				id="role"
				value={role}
				onChange={handleChange}
				className={styles.select_select}
			>
				<option value="user" className={styles.select_option}>
					User
				</option>
				<option value="admin" className={styles.select_option}>
					Admin
				</option>
			</select>
			<div className={styles.buttons}>
				<GoBackBtn>Cancel</GoBackBtn>
				<PrimaryBtn type="submit" disabled={pending}>
					Save
				</PrimaryBtn>
			</div>
		</form>
	);
}
