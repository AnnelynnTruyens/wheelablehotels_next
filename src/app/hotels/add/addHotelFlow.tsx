"use client";

import Step1 from "@/components/forms/_addHotel/Step1";
import Step2 from "@/components/forms/_addHotel/Step2";
import Step3 from "@/components/forms/_addHotel/Step3";
import Step4 from "@/components/forms/_addHotel/Step4";
import Step5 from "@/components/forms/_addHotel/Step5";
import SuccessMessage from "@/components/forms/_partials/SuccessMessage";
import { useState } from "react";

export default function AddHotelFlow() {
	const [step, setStep] = useState(1);
	const [hotelId, setHotelId] = useState<string>("");
	const [hotelName, setHotelName] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleFirstSuccess = (id: string, name: string) => {
		setHotelId(id);
		setHotelName(name);
		setStep((s) => s + 1);
	};

	const handleSuccess = () => {
		setStep((s) => s + 1);
	};

	const handleFinalSuccess = () => {
		setIsSuccess(true);
	};

	const handleError = (message: string) => {
		setError(message);
	};

	const goToPrevious = () => {
		setStep((s) => s - 1);
	};

	if (isSuccess)
		return (
			<SuccessMessage message="Hotel added successfully. Thank you for helping us make travelling more accessible!" />
		);

	switch (step) {
		case 1:
			return (
				<Step1
					onSuccess={handleFirstSuccess}
					onError={handleError}
					errorMessage={error || undefined}
				/>
			);
		case 2:
			return (
				<Step2
					hotelId={hotelId}
					hotelName={hotelName}
					onSuccess={handleSuccess}
					onError={handleError}
					errorMessage={error || undefined}
					goToPrevious={goToPrevious}
				/>
			);
		case 3:
			return (
				<Step3
					hotelId={hotelId}
					hotelName={hotelName}
					onSuccess={handleSuccess}
					onError={handleError}
					errorMessage={error || undefined}
					goToPrevious={goToPrevious}
				/>
			);
		case 4:
			return (
				<Step4
					hotelId={hotelId}
					hotelName={hotelName}
					onSuccess={handleSuccess}
					onError={handleError}
					errorMessage={error || undefined}
					goToPrevious={goToPrevious}
				/>
			);
		case 5:
			return (
				<Step5
					hotelId={hotelId}
					onSuccess={handleFinalSuccess}
					onError={handleError}
					goToPrevious={goToPrevious}
				/>
			);
		default:
			return (
				<div>
					<h1>Something went wrong</h1>
				</div>
			);
	}
}
