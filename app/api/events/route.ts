import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as Cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    let event;
    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Invalid Json data format" },
        { status: 400 },
      );
    }

    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadedResult = await new Promise((reslove, reject) => {
      Cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "DevEvent",
          },
          (error, results) => {
            if (error) return reject(error);
            reslove(results);
          },
        )
        .end(buffer);
    });
    event.image = (uploadedResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create(event);
    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find(); // to fetch the latest events
    console.log(events);
    if (!events) {
      throw new Error("No Events found");
    }
    return NextResponse.json({ message: "Success", events }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Internal server Error",
        e: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// a route that can accept slug as an input and return the events details according to this slug
