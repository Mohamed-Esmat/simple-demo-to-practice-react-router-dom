import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

//This action function will be triggered when ever the this AuthForm is submitted
export const action = async ({ request, params }) => {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  if (mode !== 'signup' && mode !== 'login') {
    throw json(
      {
        message: 'Unsupported mode.',
      },
      { status: 422 }
    );
  }
  const data = await request.formData();

  const authData = {
    email: data.get('email'),
    password: data.get('password'),
  };

  const response = await fetch('http://localhost:8080/' + mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  //422 means we have some validation errors
  //401 if we try to login with invalid credentials
  if (response.status === 422 || response.status === 401) {
    //I want to return some data to my route component, to the authForm in the end, so that i can show some error message there. and show the validation errors next to the form
    return response;
  }

  // if (response.status >= 403 && response.status <= 500) {
  // if (response.status >= 400 && response.status < 500) {
  if (!response.ok) {
    //I wanna throw an error so that my closest errorElement is rendered on the screen
    throw json({ message: 'Could not authenticate user.' }, { status: 500 });
  }

  //If we make it pass all these steps here, the user creation or signup did succeed.
  //soon: manage that token we get form the backend
  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem('token', token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString()); //to convert this date to a standardized string

  return redirect('/');
};
