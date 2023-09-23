import {
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import { useEffect } from 'react';
import { getTokenDuration } from '../util/auth';

const RootLayout = () => {
  //I don't need to use useRouteLoaderData() because here i already an in that very component
  const token = useLoaderData();
  const submit = useSubmit();

  const navigation = useNavigation();
  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    const tokenDuration = getTokenDuration();
    console.log(tokenDuration);

    const timer = setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);

    return clearTimeout(timer);
  }, [token, submit]);

  return (
    <>
      <MainNavigation />
      <main>
        {navigation.state === 'loading' && <p>Loading...</p>}
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
