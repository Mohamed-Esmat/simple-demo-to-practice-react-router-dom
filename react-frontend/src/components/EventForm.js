import {
  Form,
  json,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';

import classes from './EventForm.module.css';
import { getAuthToken } from '../util/auth';

function EventForm({ method, event }) {
  //Use useActionData ==> If i returned a response in a action
  const data = useActionData();
  const navigate = useNavigate();

  const navigation = useNavigation();

  //If navigation.state === 'submitting' I know that we are currently submitting data so that the action was triggered is currently still active
  const isSubmitting = navigation.state === 'submitting';

  function cancelHandler() {
    navigate('..');
  }

  return (
    //Importing this Form component from react-router-dom will make sure that the browser default of sending a request to the backend will be omitted, But it will take that request that would've been sent and give it to my action. and that's pretty useful because that request will contain all the data that was submitted as part of the form. therefore what you should do here is you should add the method property and set this to post for example. important:- [This request will not be send to the backend automatically, but instead to your action]
    <Form method={method} className={classes.form}>
      {data && data.errors && (
        <ul>
          {Object.values(data?.errors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <p>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          defaultValue={event ? event.title : ''}
        />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="url"
          name="image"
          required
          defaultValue={event ? event.image : ''}
        />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          required
          defaultValue={event ? event.data : ''}
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          required
          defaultValue={event ? event.description : ''}
        />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>{`${
          isSubmitting ? 'Submitting' : 'Save'
        }`}</button>
      </div>
    </Form>
  );
}

export default EventForm;

//This action function executed by react-router and receives an object that includes a couple of helpful properties to be precise again the request and params properties
export const action = async ({ request, params }) => {
  const method = request.method;
  const data = await request.formData();

  const eventData = {
    title: data.get('title'),
    image: data.get('image'),
    date: data.get('date'),
    description: data.get('description'),
  };

  let url = 'http://localhost:8080/events';

  if (method === 'PATCH') {
    url += `/${params.eventId}`;
  }

  const response = fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getAuthToken()
    },
    body: JSON.stringify(eventData),
  });

  if (response.status === 422) {
    return response;
  }

  if (response.status >= 400 && response.status < 500) {
    throw json({ message: 'Could not save this event' }, { status: 500 });
  }

  //Like JSON, Redirect creates a response object, however it's a special  response object that redirect the user to a different page
  return redirect('/events');
};
