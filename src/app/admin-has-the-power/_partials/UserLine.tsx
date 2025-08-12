"use client";

import styles from "../admin.module.css";
import DeleteButton from "@/components/buttons/DeleteBtn";
import SecondaryLinkBtn from "@/components/buttons/SecondaryLinkBtn";
import { deleteUser } from "@/lib/services/users/deleteUser";
import { useRouter } from "next/navigation";
import { use } from "passport";
import { useTransition } from "react";

type UserLineProps = {
	userId: string;
	username: string;
	email: string;
	role: string;
};

export default function UserLine({
	userId,
	username,
	email,
	role,
}: UserLineProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleDeleteUser = (userId: string) => {
		deleteUser(userId);
		startTransition(() => {
			router.refresh();
		});
	};

	return (
		<tr className={styles.table_row}>
			<td>{username}</td>
			<td>{email}</td>
			<td>{role}</td>
			<td className={styles.actions}>
				<SecondaryLinkBtn link={`/admin-has-the-power/users/${username}`}>
					Edit
				</SecondaryLinkBtn>
				<DeleteButton
					action={() => {
						handleDeleteUser(userId);
					}}
				/>
			</td>
		</tr>
	);
}
