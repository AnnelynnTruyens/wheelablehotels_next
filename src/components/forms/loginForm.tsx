"use client";

import login, { LoginState } from "@/lib/services/users/login";
import styles from "./forms.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import FormInput from "./_partials/FormInput";
import { useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";

const initialState: LoginState = {
	success: false,
	error: "",
};

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button type="submit" disabled={pending}>
			Login
		</button>
	);
}

export default function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const from = searchParams?.get("from") || "/users/profile";

	const [formData, setFormData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [state, formAction] = useActionState(login, initialState);

	// Update controlled input state manually since we're using a non-uncontrolled form
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (state.success && state.token) {
			router.push(from);
		}
	}, [state]);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<div className={styles.container_center}>
			<p className={styles.title_small}>Log in here!</p>
			<form action={formAction} className={styles.form}>
				<input type="hidden" name="email" value={formData.email} />
				<input type="hidden" name="password" value={formData.password} />

				<FormInput
					label="Email"
					type="email"
					id="email"
					name="email"
					placeholder="john.doe@example.com"
					value={formData.email}
					onChange={handleChange}
					required={true}
					autocomplete="email"
				/>

				<div className={styles.password}>
					<FormInput
						label="Password"
						type={showPassword ? "text" : "password"}
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required={true}
						autocomplete="current-password"
					/>
					<label htmlFor="showPassword" className={styles.checkbox}>
						<input
							type="checkbox"
							id="showPassword"
							checked={showPassword}
							onChange={togglePasswordVisibility}
						/>
						Show password
					</label>
				</div>

				{!state.success && state.error && (
					<p className={styles.error}>{state.error}</p>
				)}

				<div className={styles.buttons}>
					<SubmitButton />
					<Link href="/users/register">I don&apos;t have an account yet</Link>
				</div>
			</form>
		</div>
	);
}
