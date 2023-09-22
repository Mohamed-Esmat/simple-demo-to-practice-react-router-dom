// import {
//   json,
//   useRouteLoaderData,
//   useParams,
//   useLoaderData,
// } from 'react-router-dom';
// import EventItem from '../components/EventItem';

// const EventDetailsPage = () => {
//   // const data = useLoaderData();
//   const data = useRouteLoaderData('event-detail');
//   const event = data.event;
//   //give us access to the currently active route parameters
//   // const params = useParams();
//   return (
//     <>
//       <h1>Event details page</h1>
//       {/* <p>Event ID: {params.eventId}</p> */}
//       <EventItem event={event} />
//     </>
//   );
// };

// export default EventDetailsPage;

// //We still could access to the route parameters that we need because react-router-dom, which calls this loader function for you actually passes an object to this loader function when executing it for you. and that object contains two important pieces of data(a request property which contains a request object, ans a params property, and a params property which contains an object with all your route parameters, Now the request object here in a loader could be used to access the URL to For example extract query parameters or anything like that )
// export const loader = async ({ request, params }) => {
//   const id = params.eventId;
//   //react-router will wait for the promise and give us the data to which it resolves
//   const response = await fetch('http://localhost:8080/events/' + id);

//   if (!response.ok) {
//     throw json(
//       { message: 'Could not fetch details for selected event!' },
//       { status: 500 }
//     );
//   } else {
//     return response;
//   }
// };

import { Suspense } from 'react';
import {
  useRouteLoaderData,
  json,
  redirect,
  defer,
  Await,
} from 'react-router-dom';

import EventItem from '../components/EventItem';
import EventsList from '../components/EventsList';

function EventDetailPage() {
  const { event, events } = useRouteLoaderData('event-detail');

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailPage;

async function loadEvent(id) {
  const response = await fetch('http://localhost:8080/events/' + id);

  if (!response.ok) {
    throw json(
      { message: 'Could not fetch details for selected event.' },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

async function loadEvents() {
  const response = await fetch('http://localhost:8080/events');

  if (!response.ok) {
    // return { isError: true, message: 'Could not fetch events.' };
    // throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
    //   status: 500,
    // });
    throw json(
      { message: 'Could not fetch events.' },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export async function loader({ request, params }) {
  const id = params.eventId;

  return defer({
    event: await loadEvent(id),
    events: loadEvents(),
  });
}

export async function action({ params, request }) {
  const eventId = params.eventId;
  const response = await fetch('http://localhost:8080/events/' + eventId, {
    method: request.method,
  });

  if (!response.ok) {
    throw json(
      { message: 'Could not delete event.' },
      {
        status: 500,
      }
    );
  }
  return redirect('/events');
}
