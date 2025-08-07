"use client";

import Step5 from "@/components/forms/_addHotel/Step5";
import SuccessMessage from "@/components/forms/_partials/SuccessMessage";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditHotelProps = {
	hotelId: string;
};

export default function EditHotel({ hotelId }: EditHotelProps) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSuccess = () => {
		setIsSuccess(true);
	};

	const handleError = (message: string) => {
		setError(message);
	};

	const goBack = () => {
		router.back();
	};
	if (isSuccess)
		return (
			<SuccessMessage message="Hotel added successfully. Thank you for helping us make travelling more accessible!" />
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
