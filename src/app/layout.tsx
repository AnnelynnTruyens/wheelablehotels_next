import Footer from "@/components/footer/Footer";
import "./globals.css";
import Header from "@/components/header/Header";
import Head from "next/head";

export const metadata = {
	title: "Wheelable Hotels",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
