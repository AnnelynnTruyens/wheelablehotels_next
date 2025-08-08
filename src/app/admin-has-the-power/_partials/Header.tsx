"use client";

import Link from "next/link";
import styles from "../admin.module.css";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
	const pathname = usePathname();

	const linkClass = (path: string) =>
		`${styles.nav_link} ${pathname === path ? styles.nav_link_active : ""}`;
	return (
		<>
			<header className={styles.header}>
				<nav className={styles.nav}>
					<ul className={styles.nav_list}>
						<li className={styles.nav_listitem}>
							<Link
								href="/admin-has-the-power"
								className={linkClass("/admin-has-the-power")}
							>
								Dashboard
							</Link>
						</li>
						<li className={styles.nav_listitem}>
							<Link
								href="/admin-has-the-power/hotels"
								className={linkClass("/admin-has-the-power/hotels")}
							>
								Hotels
							</Link>
						</li>
						<li className={styles.nav_listitem}>
							<Link
								href="/admin-has-the-power/messages"
								className={linkClass("/admin-has-the-power/messages")}
							>
								Messages
							</Link>
						</li>
						<li className={styles.nav_listitem}>
							<Link
								href="/admin-has-the-power/users"
								className={linkClass("/admin-has-the-power/users")}
							>
								Users
							</Link>
						</li>
					</ul>
				</nav>
			</header>
		</>
	);
}
