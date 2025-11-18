const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const response = await fetch(`${BASE_URL}/api/events/${params}`);
  const { event } = await response.json();
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
    tags,
    organizer,
  } = event;
  return <section>{event.title}</section>;
};

export default EventDetails;
