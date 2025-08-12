"use client";

import Step5 from "@/components/forms/_addHotel/Step5";
import SuccessMessage from "@/components/forms/_partials/SuccessMessage";
import { getCurrentUserInfo } from "@/lib/services/users/getCurrentUserInfo";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type EditHotelProps = {
	hotelId: string;
};

export default function EditHotel({ hotelId }: EditHotelProps) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	const searchParams = useSearchParams();
	const from = searchParams?.get("from") || "/admin-has-the-power";

	useEffect(() => {
		async function getCurrentUser() {
			const user = await getCurrentUserInfo();
			if (user.role === "admin") {
				setIsAdmin(true);
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
	else
		return (
			<Step5
				hotelId={hotelId}
				onSuccess={handleSuccess}
				onError={handleError}
				goToPrevious={goBack}
				editHotel={true}
			/>
		);
}
