import EventDetailsContent from "@/components/EventDetailContent";
import { Suspense } from "react";

const EventDetailsPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = params.then((p) => p.slug);
  return (
    <Suspense fallback={<div>Loading Event...</div>}>
      <EventDetailsContent params={slug} />
    </Suspense>
  );
};

export default EventDetailsPage;
