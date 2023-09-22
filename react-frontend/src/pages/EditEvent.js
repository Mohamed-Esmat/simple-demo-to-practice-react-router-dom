import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import EventForm from '../components/EventForm';

const EditEventPage = () => {
  //To get access to a higher level loader from a route that doesn't have a loader we use useRouteLoaderData instead of useLoaderData
  // const data = useLoaderData();
  const data = useRouteLoaderData('event-detail');
  const event = data.event;
  return (
    <>
      <EventForm method='patch' event={event} />
    </>
  );
};

export default EditEventPage;
