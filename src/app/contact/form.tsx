"use client";

import styles from "./contact.module.css";
import { useState } from "react";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { createMessage } from "@/lib/services/messages/createMessage";
import SuccessMessage from "@/components/forms/SuccessMessage";

type ContactFormProps = {
	hotelId?: string;
};

export default function ContactForm({ hotelId }: ContactFormProps) {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(formData: FormData) {
		setError(null);
		setSuccess(false);

		if (typeof hotelId === "string" && hotelId.trim() !== "") {
			formData.set("hotelId", hotelId);
		} else {
			formData.delete("hotelId");
		}

		const result = await createMessage(formData);

		if (result?.error) {
			setError(result.message);
		} else {
			setSuccess(true);
		}
	}

	if (success) {
		return (
			<SuccessMessage message="Thank you for contacting us! We will email you as soon as possible." />
		);
	} else
		return (
			<form action={handleSubmit} className={styles.form}>
				{error && <p className="text-red-600">{error}</p>}

				<FormInput
					label="Name"
					type="text"
					id="name"
					name="name"
					placeholder="John Doe"
					required
					autocomplete="name"
				/>
				<FormInput
					label="Email"
					type="email"
					id="email"
					name="email"
					placeholder="john.doe@example.com"
					required
					autocomplete="email"
				/>
				<FormTextarea
					label="Message"
					id="message"
					name="message"
					placeholder="Your message"
					required
				/>

				<button type="submit">Send message</button>
			</form>
		);
}
