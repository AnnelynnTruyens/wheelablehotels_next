"use client";

type NoResultsProps = {
	insert: string;
};

export default function NoResults({ insert }: NoResultsProps) {
	return <p>No {insert} found</p>;
}
