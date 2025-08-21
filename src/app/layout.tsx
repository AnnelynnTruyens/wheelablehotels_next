import Footer from "@/components/footer/Footer";
import "./globals.css";
import Header from "@/components/header/Header";
import Script from "next/script";

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
				{/* Google Maps JS API with Places */}
				<Script
					src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&v=weekly`}
					strategy="afterInteractive"
				/>
				{/* The Extended Component Library that registers <gmpx-place-autocomplete> */}
				<Script
					src="https://unpkg.com/@googlemaps/extended-component-library@0.6/dist/index.min.js"
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
