import { getHotelBySlug } from "@/lib/services/hotels/getHotelById";
import styles from "../hotels.module.css";
import NoResults from "@/components/NoResults";
import GoBackBtn from "@/components/buttons/GoBackBtn";
import Rating from "@/components/cards/partials/rating";
import { getImagesByHotel } from "@/lib/services/images/getImagesByHotel";
import Link from "next/link";
import HotelImageGallery from "./hotelImageGallery";
import RoomCard from "@/components/cards/RoomCard";
import ReviewCard from "@/components/cards/ReviewCard";
import { getRoomsByHotel } from "@/lib/services/rooms/getRoomsByHotel";
import { getReviewsByHotel } from "@/lib/services/reviews/getReviewsByHotel";
import { ImageInfo } from "@/lib/services/images/types";
import ScrollToReviews from "./scrollToReviews";
import { RoomInfo } from "@/lib/services/rooms/types";
import { ReviewInfo } from "@/lib/services/reviews/types";
import FavouriteBtn from "@/components/buttons/FavouriteBtn";
import Loading from "@/components/Loading";
import { HotelWithRating } from "@/lib/services/hotels/types";
import HotelMap from "./map";

interface HotelDetailProps {
	params: Promise<{ hotelslug: string }>;
}

export default async function HotelDetailPage({ params }: HotelDetailProps) {
	let loading = true;
	const { hotelslug } = await params;

	const hotel: HotelWithRating = await getHotelBySlug(hotelslug);
	const images: ImageInfo[] = await getImagesByHotel(hotel._id);
	const rooms: RoomInfo[] = await getRoomsByHotel(hotel._id);
	const reviews: ReviewInfo[] = await getReviewsByHotel(hotel._id);
	loading = false;

	if (loading) {
		return (
			<main className="main">
				<title>Hotel detail | Wheelable Hotels</title>
				<Loading />
			</main>
		);
	} else if (!hotel) {
		return (
			<main className="main">
				<title>Hotel detail | Wheelable Hotels</title>
				<NoResults insert="hotel" />
			</main>
		);
	} else
		return (
			<main className="main">
				<title>Hotel detail | Wheelable Hotels</title>
				<div className={styles.buttons}>
					<GoBackBtn>Go back</GoBackBtn>
					<FavouriteBtn hotelId={hotel._id} />
				</div>
				<section className={styles.top_section}>
					<div className={styles.top_left}>
						<h1 className={styles.title}>{hotel.name}</h1>
						<p className={styles.username}>
							Added by{" "}
							{hotel.userId.username ? (
								<Link
									href={{
										pathname: `/users/${hotel.userId.username}`,
									}}
								>
									{hotel.userId.username}
								</Link>
							) : (
								"unknown"
							)}
						</p>
						<h2 className={styles.subtitle}>Accessibility</h2>
						{hotel.accessibilityFeatures?.length > 0 ? (
							<ul className={styles.features}>
								{hotel.accessibilityFeatures.map((feature) => (
									<div
										key={`accessibility-feature_${feature._id}`}
										className={styles.feature}
									>
										<img
											src={feature.icon}
											alt=""
											className={styles.feature_img}
										/>
										<li className={styles.feature_name}>{feature.name}</li>
									</div>
								))}
							</ul>
						) : (
							<NoResults insert="accessibility features" />
						)}
						<p>{hotel.accessibilityInfo}</p>
						<h2 className={styles.subtitle}>General amenities</h2>
						{hotel.amenities?.length > 0 ? (
							<ul className={styles.features}>
								{hotel.amenities.map((amenity) => (
									<div
										key={`amenity_${amenity._id}`}
										className={styles.feature}
									>
										<img
											src={amenity.icon}
											alt=""
											className={styles.feature_img}
										/>
										<li className={styles.feature_name}>{amenity.name}</li>
									</div>
								))}
							</ul>
						) : (
							<NoResults insert="amenities" />
						)}
					</div>
					<div className={styles.top_right}>
						<div className={styles.contact_reviews}>
							<div className={styles.contact_info}>
								<div className={styles.contact_item}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										aria-label="email icon"
									>
										<path
											d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<a href={`mailto:${hotel.contactEmail}`}>
										{hotel.contactEmail}
									</a>
								</div>
								<div className={styles.contact_item}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										aria-label="phone icon"
									>
										<g clipPath="url(#clip0_2051_1975)">
											<path
												d="M21.9999 16.92V19.92C22.0011 20.1985 21.944 20.4742 21.8324 20.7294C21.7209 20.9845 21.5572 21.2136 21.352 21.4019C21.1468 21.5901 20.9045 21.7335 20.6407 21.8227C20.3769 21.9119 20.0973 21.9451 19.8199 21.92C16.7428 21.5856 13.7869 20.5342 11.1899 18.85C8.77376 17.3147 6.72527 15.2662 5.18993 12.85C3.49991 10.2412 2.44818 7.271 2.11993 4.18001C2.09494 3.90347 2.12781 3.62477 2.21643 3.36163C2.30506 3.09849 2.4475 2.85669 2.6347 2.65163C2.82189 2.44656 3.04974 2.28271 3.30372 2.17053C3.55771 2.05834 3.83227 2.00027 4.10993 2.00001H7.10993C7.59524 1.99523 8.06572 2.16708 8.43369 2.48354C8.80166 2.79999 9.04201 3.23945 9.10993 3.72001C9.23656 4.68007 9.47138 5.62273 9.80993 6.53001C9.94448 6.88793 9.9736 7.27692 9.89384 7.65089C9.81408 8.02485 9.6288 8.36812 9.35993 8.64001L8.08993 9.91001C9.51349 12.4136 11.5864 14.4865 14.0899 15.91L15.3599 14.64C15.6318 14.3711 15.9751 14.1859 16.3491 14.1061C16.723 14.0263 17.112 14.0555 17.4699 14.19C18.3772 14.5286 19.3199 14.7634 20.2799 14.89C20.7657 14.9585 21.2093 15.2032 21.5265 15.5775C21.8436 15.9518 22.0121 16.4296 21.9999 16.92Z"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</g>
										<defs>
											<clipPath id="clip0_2051_1975">
												<rect width="24" height="24" fill="white" />
											</clipPath>
										</defs>
									</svg>
									<p>{hotel.contactPhone}</p>
								</div>
								<div className={styles.contact_item}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										aria-label="website icon"
									>
										<g clipPath="url(#clip0_2235_2264)">
											<path
												d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5013 19.2616 15.9228 15.708 16 12C15.9228 8.29203 14.5013 4.73835 12 2M12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2M2 12C2 6.47715 6.47715 2 12 2"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</g>
										<defs>
											<clipPath id="clip0_2235_2264">
												<rect width="24" height="24" fill="white" />
											</clipPath>
										</defs>
									</svg>
									<a href={hotel.website} target="_blank">
										{hotel.website}
									</a>
								</div>
								<div className={styles.contact_item}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
									>
										<g clipPath="url(#clip0_2270_2261)">
											<path
												d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</g>
										<defs>
											<clipPath id="clip0_2270_2261">
												<rect width="24" height="24" fill="white" />
											</clipPath>
										</defs>
									</svg>
									<p>{hotel.address}</p>
								</div>
							</div>
							<div className={styles.ratings}>
								<div className={styles.rating}>
									{hotel.rating ? (
										<>
											<Rating rating={hotel.rating} hotelDetail />
											<p>({hotel.rating}/5)</p>
										</>
									) : (
										<>
											<Rating rating={0} hotelDetail />
											<p>(-/5)</p>
										</>
									)}
								</div>
								<ScrollToReviews reviews={reviews} />
							</div>
						</div>
						<HotelImageGallery images={images} />
						<HotelMap
							lat={Number(hotel.location?.lat)}
							lng={Number(hotel.location?.lng)}
						/>
					</div>
				</section>
				<section className={styles.room_section}>
					<h2 className={styles.subtitle}>Rooms</h2>
					<div className={styles.rooms}>
						{rooms && rooms.length > 0 ? (
							rooms.map((room) => {
								return (
									<RoomCard
										key={`room_${room._id}`}
										roomName={room.name}
										roomDescription={room.description}
										accessibilityFeatures={room.accessibilityFeatures}
										accessibilityInfo={room.accessibilityInfo}
									/>
								);
							})
						) : (
							<NoResults insert="rooms" />
						)}
					</div>
				</section>
				<section id="reviews" className={styles.review_section}>
					<h2 className={styles.subtitle}>Reviews</h2>
					<div className={styles.rating_top}>
						<div className={styles.rating}>
							{hotel.rating ? (
								<>
									<Rating rating={hotel.rating} hotelDetail />
									<p>({hotel.rating}/5)</p>
								</>
							) : (
								<>
									<Rating rating={0} hotelDetail />
									<p>(-/5)</p>
								</>
							)}
						</div>
						<Link className="button" href={`/hotels/${hotelslug}/review`}>
							Add review
						</Link>
					</div>
					<div className={styles.reviews}>
						{reviews && reviews.length > 0 ? (
							reviews.map((review) => {
								return (
									<ReviewCard
										key={`review_${review._id}`}
										username={review.userId.username}
										rating={review.rating}
										review={review.message}
									/>
								);
							})
						) : (
							<NoResults insert="reviews" />
						)}
					</div>
					<Link className="button" href={`/hotels/${hotelslug}/review`}>
						Add review
					</Link>
				</section>
				<section>
					<h2 className={styles.subtitle}>Noticed a mistake?</h2>
					<Link
						href={`/contact?hotelName=${hotel.name}&hotelId=${hotel._id}`}
						className="button"
					>
						Report a mistake
					</Link>
				</section>
			</main>
		);
}
