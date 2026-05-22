import React from "react";
import Link from "next/link";
import Image from "next/image";
interface props {
  slug: string;
  title: string;
  image: string;
  location: string;
  time: string;
  date: string;
}

const EventCard = ({ title, image, slug, location, time, date }: props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image src={image} alt="Dev event" width={410} height={300} />
      <div className="flex flex-row gap-2">
        <Image src={"/icons/pin.svg"} alt="location" height={14} width={14} />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>

      <div className="datetime">
        <div>
          <Image
            src={"/icons/calendar.svg"}
            alt="date"
            height={14}
            width={14}
          />
          <p>{date}</p>
        </div>
        <div>
          <Image src={"/icons/clock.svg"} alt="time" height={14} width={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
