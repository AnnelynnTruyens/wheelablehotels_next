import React from "react";
import styles from "./progress.module.css";

interface ProgressProps {
	step: number;
}

export default function Progress({ step }: ProgressProps) {
	const steps = [
		{
			label: "Start",
			icon: "M18 44V24H30V44M6 18L24 4L42 18V40C42 41.0609 41.5786 42.0783 40.8284 42.8284C40.0783 43.5786 39.0609 44 38 44H10C8.93913 44 7.92172 43.5786 7.17157 42.8284C6.42143 42.0783 6 41.0609 6 40V18Z",
		},
		{
			label: "Hotel info",
			icon: "M24 32V24M24 16H24.02M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z",
		},
		{
			label: "Rooms",
			icon: "M28 4H12C10.9391 4 9.92172 4.42143 9.17157 5.17157C8.42143 5.92172 8 6.93913 8 8V40C8 41.0609 8.42143 42.0783 9.17157 42.8284C9.92172 43.5786 10.9391 44 12 44H36C37.0609 44 38.0783 43.5786 38.8284 42.8284C39.5786 42.0783 40 41.0609 40 40V16M28 4L40 16M28 4V16H40M24 36V24M18 30H30",
		},
		{
			label: "Photos",
			icon: "M10 42H38C40.2091 42 42 40.2091 42 38V10C42 7.79086 40.2091 6 38 6H10C7.79086 6 6 7.79086 6 10V38C6 40.2091 7.79086 42 10 42ZM10 42L32 20L42 30M20 17C20 18.6569 18.6569 20 17 20C15.3431 20 14 18.6569 14 17C14 15.3431 15.3431 14 17 14C18.6569 14 20 15.3431 20 17Z",
		},
		{
			label: "Overview",
			icon: "M44 22.16V24C43.9975 28.3128 42.601 32.5094 40.0187 35.9637C37.4363 39.418 33.8066 41.945 29.6707 43.1678C25.5349 44.3906 21.1145 44.2438 17.0689 42.7492C13.0234 41.2545 9.56931 38.4922 7.22192 34.8741C4.87453 31.2561 3.75958 26.9761 4.04335 22.6726C4.32712 18.3691 5.99441 14.2727 8.79656 10.9941C11.5987 7.71564 15.3856 5.43077 19.5924 4.4803C23.7992 3.52982 28.2005 3.96468 32.14 5.72M44 8L24 28.02L18 22.02",
		},
	];

	return (
		<div className={styles.container}>
			{steps.map(({ label, icon }, index) => (
				<React.Fragment key={index}>
					{/* Step Circle */}
					<div
						className={
							index + 1 === step
								? styles.step_active
								: index + 1 < step
								? styles.step_past
								: styles.step
						}
					>
						<div className={styles.icon_border}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 48 48"
								fill="none"
								className={styles.icon}
							>
								<path d={icon} />
							</svg>
						</div>
						<p className={styles.step_text}>{label}</p>
					</div>

					{/* Connecting Line */}
					{index < steps.length - 1 && (
						<div
							className={index + 1 < step ? styles.line_bold : styles.line}
						/>
					)}
				</React.Fragment>
			))}
		</div>
	);
}
