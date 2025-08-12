"use client";

import styles from "../admin.module.css";
import DeleteButton from "@/components/buttons/DeleteBtn";
import SecondaryLinkBtn from "@/components/buttons/SecondaryLinkBtn";

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
	const deleteUser = (userId: string) => {
		console.log("user to delete: " + userId);
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
						deleteUser(userId);
					}}
				/>
			</td>
		</tr>
	);
}
