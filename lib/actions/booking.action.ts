"use server";
import Booking from "@/database/booking.model";
import connectDB from "../mongodb";

export async function CreateBooking({
  eventId,
  email,
  slug,
}: {
  eventId: string;
  email: string;
  slug: string;
}) {
  try {
    await connectDB();
    await Booking.create({ eventId, slug, email });
    return { success: true };
  } catch (error) {
    console.error("Create booking failed", error);
    return { success: false };
  }
}
