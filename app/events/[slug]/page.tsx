import { notFound } from "next/navigation";

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
  );
  const { event } = await response.json();
  if (!event) notFound();
  console.log(event, "this is use event");
  return (
    <section id="event">
      <h1>Event Details: {slug}</h1>
    </section>
  );
};
export default EventDetailsPage;
