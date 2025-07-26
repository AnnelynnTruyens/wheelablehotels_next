"use client";

import Link from "next/link";
import styles from "./header.module.css";
import { usePathname } from "next/navigation";
import SecondaryLinkBtn from "../buttons/SecondaryLinkBtn";

export default function Header() {
	const pathname = usePathname();

	// Helper: returns the right class string
	const linkClass = (path: string) =>
		`${styles.nav_link} ${pathname === path ? styles.nav_link_active : ""}`;

	const iconClass = (path: string) =>
		`${styles.nav_icon} ${pathname === path ? styles.nav_icon_active : ""}`;
	const userIconClass = (path: string) =>
		`${styles.nav_icon} ${styles.icon_user} ${
			pathname === path
				? `${styles.nav_icon_active} ${styles.icon_user_active}`
				: ""
		}`;

	return (
		<>
			<a
				onClick={(e) => {
					e.preventDefault();
					const main = document.querySelector("main");
					if (main) {
						main.setAttribute("tabIndex", "-1");
						main.focus();
						main.scrollIntoView({ behavior: "smooth" });
					}
				}}
				className={styles.skip}
				href="#main"
			>
				Skip to main content
			</a>

			<header className={pathname === "/" ? styles.header_home : styles.header}>
				<Link href="/">
					<img
						src="/logo/Logo_WheelableHotels.svg"
						alt="logo Wheelable Hotels"
						className={styles.logo}
					/>
				</Link>

				<nav className={styles.nav}>
					<ul className={styles.nav_list}>
						<li className={styles.nav_listitem}>
							<Link href="/hotels" className={linkClass("/hotels")}>
								Search hotels
							</Link>
						</li>
						<li className={styles.nav_listitem}>
							<SecondaryLinkBtn link="/hotels/add">
								Add a hotel
							</SecondaryLinkBtn>
						</li>
						<li className={styles.nav_listitem}>
							<Link
								href="/users/profile/favourites"
								className={linkClass("/users/profile/favourites")}
								aria-label="favourites"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									viewBox="0 0 32 32"
									fill="none"
									className={iconClass("/users/profile/favourites")}
								>
									<path
										d="M27.7867 6.14666C27.1057 5.46533 26.2971 4.92485 25.4071 4.5561C24.5172 4.18735 23.5633 3.99756 22.6 3.99756C21.6367 3.99756 20.6828 4.18735 19.7929 4.5561C18.9029 4.92485 18.0943 5.46533 17.4133 6.14666L16 7.55999L14.5867 6.14666C13.2111 4.77107 11.3454 3.99827 9.4 3.99827C7.45462 3.99827 5.58892 4.77107 4.21333 6.14666C2.83774 7.52225 2.06494 9.38795 2.06494 11.3333C2.06494 13.2787 2.83774 15.1444 4.21333 16.52L16 28.3067L27.7867 16.52C28.468 15.839 29.0085 15.0304 29.3772 14.1405C29.746 13.2505 29.9358 12.2966 29.9358 11.3333C29.9358 10.37 29.746 9.41613 29.3772 8.52619C29.0085 7.63624 28.468 6.82767 27.7867 6.14666Z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Link>
						</li>
						<li className={styles.nav_listitem}>
							<Link
								href="/users/profile"
								className={linkClass("/users/profile")}
								aria-label="profile"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									className={userIconClass("/users/profile")}
								>
									<path
										d="M22.6667 26V23.3333C22.6667 21.9188 22.1048 20.5623 21.1046 19.5621C20.1044 18.5619 18.7479 18 17.3334 18H6.66671C5.25222 18 3.89566 18.5619 2.89547 19.5621C1.89528 20.5623 1.33337 21.9188 1.33337 23.3333V26M17.3334 7.33333C17.3334 10.2789 14.9456 12.6667 12 12.6667C9.05452 12.6667 6.66671 10.2789 6.66671 7.33333C6.66671 4.38781 9.05452 2 12 2C14.9456 2 17.3334 4.38781 17.3334 7.33333Z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Link>
						</li>
					</ul>
				</nav>
			</header>
		</>
	);
}
