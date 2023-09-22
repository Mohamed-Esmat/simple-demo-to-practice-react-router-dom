//suspense component is a component which can be used in a certain situations to show a fallback whilst we're waiting for other data to arrive
import { Suspense } from 'react';
import { Await, defer, json, useLoaderData } from 'react-router-dom';
import EventsList from '../components/EventsList';

function EventsPage() {
  //We can access data with useLoaderData in any component in the same level or lower level [That means: you can use useLoaderData() in the  element that's assigned to a route AND in all components that might be used inside that element]
  const { events } = useLoaderData();

  // if (data.isError) {
  //   return <div>Error: {JSON.stringify(data.message)}</div>;
  // }
  // const events = data.events;
  // return (
  //   <>
  //     <EventsList events={events} />
  //   </>
  // );

  return (
    <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
}

const loadEvents = async () => {
  const response = await fetch('http://localhost:8080/events');

  if (!response.ok) {
    // return { isError: true, message: 'Could not fetch events' };
    //Now when an error get thrown in a loader something special happens React Router will simply render the closest errorElement
    // throw { message: 'Could not fetch events'};

    // throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
    //   status: 500,
    // });
    //another and a simpler way to the previous
    throw json(
      {
        message: 'Could not fetch events.',
      },
      { status: 500 }
    );
  } else {
    // const resData = await response.json();
    // return resData.events;

    //I can't directly return response like this when we use the defer function in between the loader function and the useLoaderData() or useRouteLoaderData()
    // return response;

    const resData = await response.json();
    return resData.events;
  }
};

export const loader = () => {
  //defer takes an object which we will bundle all the different  HTTP requests we might have going on on this page
  return defer({
    events: loadEvents(),
  });
};
export default EventsPage;
