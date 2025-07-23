import PrimaryBtn from "@/components/buttons/PrimaryBtn";
import styles from "./page.module.css";
import SecondaryBtn from "@/components/buttons/SecondaryBtn";
import PrimaryLinkBtn from "@/components/buttons/PrimaryLinkBtn";
import SecondaryLinkBtn from "@/components/buttons/SecondaryLinkBtn";
import GoBackBtn from "@/components/buttons/GoBackBtn";
import HotelCard from "@/components/cards/HotelCard";
import HotelHighlight from "@/components/cards/HotelHighlight";
import ReviewCard from "@/components/cards/ReviewCard";
import RoomCard from "@/components/cards/RoomCard";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import FormCheckbox from "@/components/forms/FormCheckbox";
import FormFileInput from "@/components/forms/FormFileInput";

export default function Home() {
	return (
		<div className={styles.page}>
			<h1>Home</h1>
			<p>This is the home page</p>
			<h2>Buttons</h2>
			<div>
				<PrimaryBtn>Primary Button</PrimaryBtn>
				<SecondaryBtn>Secondary Button</SecondaryBtn>
				<PrimaryLinkBtn link="">Primary Link Button</PrimaryLinkBtn>
				<SecondaryLinkBtn link="">Secondary Link Button</SecondaryLinkBtn>
				<GoBackBtn>Go back</GoBackBtn>
			</div>
			<h2>Cards</h2>
			<div>
				<HotelCard
					hotelName="hotel somewhere"
					hotelId="1"
					location="somewhere in this world"
					accessibilityFeatures={[
						{ _id: "1", name: "feature-1" },
						{ _id: "2", name: "feature-2" },
					]}
					rating={3}
				/>
				<HotelHighlight
					hotelName="hotel somewhere"
					hotelId="1"
					location="somewhere in this world"
					rating={3}
				/>
				<ReviewCard
					username="user560"
					rating={3}
					review="great hotel, would recommend to everyone"
				/>
				<RoomCard
					roomName="room name"
					accessibilityFeatures={[
						{ _id: "1", name: "feature-1" },
						{ _id: "2", name: "feature-2" },
					]}
					roomDescription="this is an accessible room"
					accessibilityInfo="some accessibility info"
				/>
			</div>
			<h2>Form partials</h2>
			<div>
				<FormInput
					label="label"
					type="text"
					id="id"
					name="name"
					value={"value"}
					placeholder="placeholder"
				/>
				<FormTextarea
					label="label"
					id="id"
					name="name"
					value={"value"}
					placeholder="placeholder"
				/>
				<FormCheckbox
					label="label"
					id="id"
					name="name"
					value={"value"}
					placeholder="placeholder"
				/>
				<FormFileInput label="label" id="id" name="name" />
			</div>
		</div>
	);
}
