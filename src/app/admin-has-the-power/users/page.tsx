import styles from "../admin.module.css";
import AdminHeader from "../_partials/Header";
import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/middleware/auth";
import { redirect } from "next/navigation";
import { UserInfo } from "@/lib/services/users/types";
import { getCurrentUserInfo } from "@/lib/services/users/getCurrentUserInfo";
import { getAllUsers } from "@/lib/services/users/getAllUsers";
import UserLine from "../_partials/UserLine";
import NoResults from "@/components/NoResults";

export default async function AdminUserOverview() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("authToken")?.value;
	const from = "/admin-has-the-power";

	if (!token || isTokenExpired(token)) {
		redirect(`/users/login?from=${encodeURIComponent(from)}`);
	}

	const user: UserInfo = await getCurrentUserInfo();

	if (user.role !== "admin") {
		redirect("/");
	}

	const users = await getAllUsers();

	return (
		<>
			<AdminHeader />
			<main id="main" className="admin-main">
				<h1>Users</h1>
				<table className={styles.table}>
					<tbody>
						<tr className={styles.table_row}>
							<th className={styles.table_head}>Username</th>
							<th className={styles.table_head}>Email</th>
							<th className={styles.table_head}>Role</th>
							<th className={styles.table_head}>Actions</th>
						</tr>

						{users && users.length > 0 ? (
							users.map((user) => {
								return (
									<UserLine
										key={`user_${user._id}`}
										userId={user._id}
										username={user.username}
										email={user.email}
										role={user.role}
									/>
								);
							})
						) : (
							<NoResults insert="users" />
						)}
					</tbody>
				</table>
			</main>
		</>
	);
}
