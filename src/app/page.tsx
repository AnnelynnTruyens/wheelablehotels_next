import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.page}>
			<h1>Home</h1>
			<p>This is the home page</p>
			<button>This is a button</button>
		</div>
	);
}
