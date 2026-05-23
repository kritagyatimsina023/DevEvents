import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

const EventDetailsContent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  "use cache";

  cacheLife("hours");
  const { slug } = await params;
  let data;

  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!request.ok) {
      if (request.status === 404) {
        return notFound();
      }

      throw new Error(`failed to fetch event:${request.statusText}`);
    }

    data = await request.json();

    if (!data) return notFound();
  } catch (error) {
    console.error("Error fetching event", error);
    return notFound();
  }

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    organizer,
    tags,
  } = data.event;

  if (!description) return notFound();

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  const bookings = 10;

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            className="banner"
            src={image}
            alt="event-banner"
            width={800}
            height={800}
          />

          <section className="flex flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex flex-col-gap-2">
            <h2>Event Details</h2>

            <p>{date}</p>
            <p>{time}</p>
            <p>{location}</p>
            <p>{mode}</p>
            <p>{audience}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <div key={tag} className="pill">
                {tag}
              </div>
            ))}
          </div>
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book your spot</h2>

            {bookings > 0 ? (
              <p className="text-sm">
                join {bookings} people who have already booked spot
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot</p>
            )}

            <BookEvent eventId={data.event._id} slug={data.event.slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>

        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((event: IEvent) => (
              <EventCard key={event._id} {...event} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsContent;
