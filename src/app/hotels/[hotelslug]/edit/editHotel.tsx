"use client";

import Step5 from "@/components/forms/_addHotel/Step5";
import SuccessMessage from "@/components/forms/_partials/SuccessMessage";
import Loading from "@/components/Loading";
import { getHotelById } from "@/lib/services/hotels/getHotelById";
import { getCurrentUserInfo } from "@/lib/services/users/getCurrentUserInfo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EditHotelProps = {
	hotelId: string;
	addedByUser: string;
	hotelStatus: string;
};

export default function EditHotel({
	hotelId,
	addedByUser,
	hotelStatus,
}: EditHotelProps) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [isAuthorised, setIsAuthorised] = useState<boolean>(false);

	useEffect(() => {
		async function getCurrentUser() {
			const user = await getCurrentUserInfo();
			if (user.role === "admin") {
				setIsAuthorised(true);
				setIsAdmin(true);
			} else if (user.username === addedByUser && hotelStatus !== "published") {
				setIsAuthorised(true);
				setIsAdmin(false);
			} else {
				goBack();
			}
		}

		getCurrentUser();
	}, []);

	useEffect(() => {
		if (isSuccess && isAdmin) {
			goBack();
		}
	}, [isSuccess, isAdmin, router]);

	const handleSuccess = () => {
		setIsSuccess(true);
	};

	const handleError = (message: string) => {
		setError(message);
	};

	const goBack = () => {
		router.back();
	};

	if (isSuccess && !isAdmin)
		return (
			<SuccessMessage message="Hotel edited successfully. Thank you for helping us make travelling more accessible!" />
		);
	if (isAuthorised) {
		return (
			<Step5
				hotelId={hotelId}
				onSuccess={handleSuccess}
				onError={handleError}
				goToPrevious={goBack}
				editHotel={true}
			/>
		);
	} else return <Loading />;
}
