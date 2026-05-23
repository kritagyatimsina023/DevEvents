import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
// import { events } from "@/lib/constants";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
const Page = async () => {
  "use cache";
  cacheLife("hours"); // this means nextjs will cache this 3 events (That means this Db will not be re-fetching the queries from the mongoDb until an hours)
  const response = await fetch(`${BASE_URL}/api/events`, { method: "GET" });
  const { events } = await response.json();
  if (!events) notFound();
  return (
    <section>
      <h1 className="text-center">
        The Hub for every dev <br /> Event you can't miss
      </h1>
      <p className="text-center mt-5">
        Hackathons , MeetUps , and Conferences. All in the One place
      </p>
      <ExploreBtn />
      <div className="">
        <h1>Features Events</h1>
        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li className="list-none" key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
