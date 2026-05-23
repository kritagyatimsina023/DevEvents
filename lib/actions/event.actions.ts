"use server";

import Event from "@/database/event.model";
import connectDB from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });
    console.log(event, "from event actions");
    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean(); // similar events on the basis of this tags
    console.log("Similar events", similarEvents);
    return JSON.parse(JSON.stringify(similarEvents));
  } catch (e) {
    console.error(e, "error in event action");
    return [];
  }
};
