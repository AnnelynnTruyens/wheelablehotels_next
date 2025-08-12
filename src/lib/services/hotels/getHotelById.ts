"use server";

import NotFoundError from "@/lib/middleware/errors/NotFoundError";
import HotelModel from "@/lib/modules/Hotel/Hotel.model";
import { connectToDatabase } from "@/lib/mongoose";
import { calculateAverageRating } from "./utils";
import { Amenity } from "@/lib/modules/Amenity/Amenity.types";
import { AccessibilityFeature } from "@/lib/modules/AccessibilityFeature/AccessibilityFeature.types";
import { HotelWithRating } from "./types";
import { User } from "@/lib/modules/User/User.types";
import "@/lib/modules/Amenity/Amenity.model";
import "@/lib/modules/AccessibilityFeature/AccessibilityFeature.model";
import "@/lib/modules/User/User.model";

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
		location: hotel.location,
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
		location: hotel.location,
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
