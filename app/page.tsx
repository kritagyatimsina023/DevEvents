import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";
// const event = [
//   { image: "/images/event1.png", slug:"Event one",title: "Event 1" },
//   { image: "/images/event2.png", title: "Event 2" },
//   { image: "/images/event3.png", title: "Event 3" },
// ];

const Page = () => {
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
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
