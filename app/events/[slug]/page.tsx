import EventDetailsContent from "@/components/EventDetailContent";
import { Suspense } from "react";

const EventDetailsPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  return (
    <Suspense fallback={<div>Loading Event...</div>}>
      <EventDetailsContent params={params} />
    </Suspense>
  );
};

export default EventDetailsPage;
