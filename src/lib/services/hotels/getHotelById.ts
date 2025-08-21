"use server";

import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";
import { connectToDatabase } from "@/lib/mongoose";
import { calculateAverageRating } from "./utils";
import { HotelWithRating } from "./types";
import { User } from "@/lib/modules/User/User.types";
import "@/lib/modules/Amenity/Amenity.model";
import "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";
import "@/lib/modules/User/User.model";
import { Amenity } from "../amenities/types";
import { AccessibilityFeature } from "../accessibilityFeatures/types";

export async function getHotelBySlug(slug: string): Promise<HotelWithRating> {
	await connectToDatabase();

	const hotel = await HotelModel.findOne({ slug: slug })
		.populate("amenities")
		.populate("accessibilityFeatures")
		.populate("userId", "username");

	if (!hotel) {
		throw new NotFoundError("Hotel not found");
	}

	const avgRating = await calculateAverageRating(hotel._id.toString());

	const hotelWithRating: HotelWithRating = {
		_id: hotel._id.toString(),
		name: hotel.name,
		slug: hotel.slug,
		address: hotel.address,
		location: {
			lat: hotel.location?.lat?.toString(),
			lng: hotel.location?.lng?.toString(),
		},
		contactEmail: hotel.contactEmail,
		contactPhone: hotel.contactPhone,
		website: hotel.website,
		rating: avgRating,
		userId: {
			_id: (hotel.userId as User)._id?.toString(),
			username: (hotel.userId as User).username,
		},
		status: hotel.status,
		accessibilityInfo: hotel.accessibilityInfo,
		amenities: (hotel.amenities as Amenity[]).map((a) => ({
			_id: a._id.toString(),
			name: a.name,
			icon: a.icon,
		})),
		accessibilityFeatures: (
			hotel.accessibilityFeatures as AccessibilityFeature[]
		).map((f) => ({
			_id: f._id.toString(),
			name: f.name,
			icon: f.icon,
		})),
	};

	return hotelWithRating;
}

export async function getHotelById(id: string): Promise<HotelWithRating> {
	await connectToDatabase();

	const hotel = await HotelModel.findOne({ _id: id })
		.populate("amenities")
		.populate("accessibilityFeatures")
		.populate("userId", "username");

	if (!hotel) {
		throw new NotFoundError("Hotel not found");
	}

	const avgRating = await calculateAverageRating(hotel._id.toString());

	const hotelWithRating: HotelWithRating = {
		_id: hotel._id.toString(),
		name: hotel.name,
		slug: hotel.slug,
		address: hotel.address,
		location: {
			lat: hotel.location?.lat?.toString(),
			lng: hotel.location?.lng?.toString(),
		},
		contactEmail: hotel.contactEmail,
		contactPhone: hotel.contactPhone,
		website: hotel.website,
		rating: avgRating,
		userId: {
			_id: (hotel.userId as User)._id?.toString(),
			username: (hotel.userId as User).username,
		},
		status: hotel.status,
		accessibilityInfo: hotel.accessibilityInfo,
		amenities: (hotel.amenities as Amenity[]).map((a) => ({
			_id: a._id.toString(),
			name: a.name,
		})),
		accessibilityFeatures: (
			hotel.accessibilityFeatures as AccessibilityFeature[]
		).map((f) => ({
			_id: f._id.toString(),
			name: f.name,
		})),
	};

	return hotelWithRating;
}
