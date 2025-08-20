import Link from "next/link";
import styles from "./page.module.css";
import HotelHighlight from "@/components/cards/HotelHighlight";
import "@/lib/modules/Amenity/Amenity.model";
import "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";
import { getTopRatedHotels } from "@/lib/services/hotels/getTopRatedHotels.ts";
import SearchSection from "./hotels/searchSection";
import RegisterForm from "@/components/forms/registerForm";
import { HotelWithRatingSimple } from "@/lib/services/hotels/types";

// Server component (SEO-friendly)
export default async function HomePage() {
	const hotels = await getTopRatedHotels();

	return (
		<main id="main" className={styles.main_home}>
			<title>Wheelable Hotels</title>

			<div className={styles.hero}>
				<SearchSection />
			</div>

			<div className={styles.content}>
				<section className={`${styles.section} ${styles.intro}`}>
					<div className={`${styles.section_text} ${styles.intro_text}`}>
						<p>
							<span className={styles.intro_name}>Wheelable Hotels</span> is a
							platform made by and for wheelchair users. It&apos;s our mission
							to make finding accessible hotels easier. On our platform, you can
							search hotels by destination or name, and you can filter them
							based on your accessibility needs. You can also find accessibility
							information about the hotel and the accessible rooms.
						</p>
						<p>
							We know how important experiences from others are when looking at
							hotels, so you can also see ratings and reviews from others. To
							make your search easier, you can save hotels to your favourites
							and come back to them at a later time.
						</p>
						<p>
							All of our hotels are added by members of the community and all
							information has been checked by an admin before being published on
							the platform. This way we try to reduce the extra research that
							comes with travelling as a wheelchair user. We can&apos;t
							guarantee that all information is 100% correct, but if you find
							any mistakes, please <Link href="/contact">contact us</Link> and
							let us know.
						</p>
					</div>
					<img
						src="/assets/DSC_0045.jpg"
						alt="Girl in wheelchair in front of beach"
						className={styles.intro_img}
					/>
				</section>

				<section className={`${styles.section} ${styles.community}`}>
					<div className={styles.community_left}>
						<h1 className={styles.section_title}>Community-based</h1>
						<p className={styles.section_text}>
							Our platform is community-based. All of our hotels are added by
							community member, based on their own experiences...
						</p>
						<p className={styles.section_text}>
							Join us in creating a more accessible travel experience, one hotel
							at a time.
						</p>
					</div>
					<RegisterForm />
				</section>

				<section className={`${styles.section} ${styles.hotels}`}>
					<h1 className={styles.section_title}>Community favourites</h1>
					<div className={styles.hotel_highlights}>
						{hotels.map((hotel: HotelWithRatingSimple) => (
							<HotelHighlight
								key={`hotel_${hotel._id}`}
								hotelId={hotel._id}
								hotelName={hotel.name}
								pathname={`/hotels/${hotel.slug}`}
								location={hotel.address}
								rating={hotel.rating}
							/>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
