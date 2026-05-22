"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

interface props {
  slug: string;
  title: string;
  image: string;
  location: string;
  time: string;
  date: string;
}

const EventCard = ({ title, image, slug, location, time, date }: props) => {
  const handleClick = () => {
    posthog.capture("event_card_clicked", {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };

  return (
    <Link href={`/events/${slug}`} id="event-card" onClick={handleClick}>
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
