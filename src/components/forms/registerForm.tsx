"use client";

import Link from "next/link";
import FormInput from "./_partials/FormInput";
import styles from "./forms.module.css";
import { useFormStatus } from "react-dom";
import register, { RegisterState } from "@/lib/services/users/register";
import { useActionState } from "react";
import { stat } from "fs";
import SuccessMessage from "./_partials/SuccessMessage";
import PrimaryBtn from "../buttons/PrimaryBtn";
import PrimaryLinkBtn from "../buttons/PrimaryLinkBtn";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button type="submit" disabled={pending}>
			Register
		</button>
	);
}

export default function RegisterForm() {
	const initialState: RegisterState = {
		success: false,
		error: "",
	};
	const [state, formAction] = useActionState(register, initialState);

	if (state.success)
		return (
			<>
				<SuccessMessage message="You have been registered successfully! Welcome to the Wheelable Hotels community!" />
				<PrimaryLinkBtn link={"/users/login"}>Log in</PrimaryLinkBtn>
			</>
		);
	return (
		<div className={styles.container_center}>
			<p className={styles.title_small}>Join our community!</p>
			<form action={formAction} className={styles.form}>
				<FormInput
					label="Username"
					type="text"
					id="username"
					name="username"
					placeholder="JohnDoe"
					required
					autocomplete="username"
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
				<FormInput
					label="Password"
					type="password"
					id="password"
					name="password"
					required
					autocomplete="new-password"
				/>
				<input type="hidden" name="role" value="user" />

				{!state.success && state.error && (
					<p className={styles.error}>{state.error}</p>
				)}

				<div className={styles.buttons}>
					<SubmitButton />
					<Link href="/users/login" className={styles.form_link}>
						I already have an account
					</Link>
				</div>
			</form>
		</div>
	);
}
