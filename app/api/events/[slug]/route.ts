import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
type EventRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};
export async function GET(
  _request: Request,
  context: EventRouteContext,
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;
    const normalizedSlug = slug.trim().toLowerCase();

    // Reject missing or malformed slugs before querying MongoDB.
    if (!normalizedSlug) {
      return NextResponse.json(
        { message: "Missing slug route parameter" },
        { status: 400 },
      );
    }

    if (!SLUG_PATTERN.test(normalizedSlug)) {
      return NextResponse.json(
        { message: "Invalid slug format" },
        { status: 400 },
      );
    }

    await connectDB();

    const event = await Event.findOne({ slug: normalizedSlug }).lean();

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          message: "Validation error while fetching event",
          error: error.message,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        message: "Unexpected error while fetching event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
