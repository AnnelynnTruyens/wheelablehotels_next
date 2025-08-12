import { UserInfo } from "@/lib/services/users/types";
import styles from "../../admin.module.css";
import { getUserInfo } from "@/lib/services/users/getUserInfo";
import AdminHeader from "../../_partials/Header";
import NoResults from "@/components/NoResults";
import PrimaryBtn from "@/components/buttons/PrimaryBtn";
import GoBackBtn from "@/components/buttons/GoBackBtn";

interface UserDetailProps {
	params: Promise<{ username: string }>;
}

export default async function AdminUserDetail({ params }: UserDetailProps) {
	const { username } = await params;

	const user: UserInfo = await getUserInfo(username);

	if (!user) {
		return (
			<>
				<AdminHeader />
				<title>User detail | Admin Wheelable Hotels</title>
				<main id="main" className="admin-main">
					<NoResults insert="user" />
				</main>
			</>
		);
	}

	return (
		<>
			<AdminHeader />
			<title>User detail | Admin Wheelable Hotels</title>
			<main id="main" className="admin-main">
				<h1>User: {username}</h1>
				<p>Email: {user.email}</p>
				<form action="">
					<label htmlFor="role">Role</label>
					<select name="role" id="role" value={user.role}>
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</form>
				<div className={styles.buttons}>
					<GoBackBtn>Cancel</GoBackBtn>
					<PrimaryBtn>Edit</PrimaryBtn>
				</div>
			</main>
		</>
	);
}
