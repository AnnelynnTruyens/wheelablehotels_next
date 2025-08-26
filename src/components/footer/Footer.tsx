"use client";

import styles from "./footer.module.css";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<Link href="/" className={styles.brand} aria-label="home">
				<picture>
					<source
						media="(prefers-color-scheme: dark)"
						srcSet="/logo/Logo_WheelableHotels_light.svg"
					/>
					<img
						src="/logo/Logo_WheelableHotels.svg"
						alt="Wheelable Hotels"
						className={styles.logo}
					/>
				</picture>
			</Link>
			<nav className={styles.nav}>
				<ul className={styles.nav_list}>
					<li className={styles.nav_listitem}>
						<Link href="/hotels" className={styles.nav_link}>
							Search hotels
						</Link>
					</li>
					<li className={styles.nav_listitem}>
						<Link href="/users/profile" className={styles.nav_link}>
							Profile
						</Link>
					</li>
					<li className={styles.nav_listitem}>
						<Link href="/contact" className={styles.nav_link}>
							Contact
						</Link>
					</li>
					<li className={styles.nav_listitem}>
						<Link href="/accessibility-statement" className={styles.nav_link}>
							Accessibility statement
						</Link>
					</li>
					<li className={styles.nav_listitem}>
						<Link href="/privacy-statement" className={styles.nav_link}>
							Privacy statement
						</Link>
					</li>
				</ul>
			</nav>
		</footer>
	);
}
