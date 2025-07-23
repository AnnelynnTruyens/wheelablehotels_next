"use client";

type ErrorProps = {
	message: string | undefined;
};

export default function Error({ message }: ErrorProps) {
	return <p role="log">Error: {message}</p>;
}
