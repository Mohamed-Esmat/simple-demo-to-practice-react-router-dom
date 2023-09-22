import { useFetcher } from 'react-router-dom';
import classes from './NewsletterSignup.module.css';
import { useEffect } from 'react';

function NewsletterSignup() {
  const fetcher = useFetcher();
  const { data, state } = fetcher;

  useEffect(() => {
    if (state === 'idle' && data && data.message) {
      alert(data.message);
    }
  }, [data, state]);

  /**
   * There is a special hook which you can import

from react-router-dom, and that is the useFetcher hook.

The name might be a bit strange

but this hook when executed gives you an object.

And this object includes a bunch

of useful properties and methods.

For example, it gives you another form component

which is different from that other form component

we used before.

It also gives you a submit function

which is different from the submit function we got

from useSubmit, which we used before.

But what is the difference between this form we get here

and this submit function which we get here?

Well, if we use this Fetcher Form component like this

which we can then this will actually still trigger an action

but it will not initialize a route transition.

So Fetcher should basically be used whenever

you wanna trigger, an action, or also a loader

with help of the load function without actually navigating

to the page to which the loader belongs

or the page to which the action belongs.

On this form here we can add the action attribute
   */

  //To conclude with fetcher.Form we don't transition we don't go back

  return (
    <fetcher.Form
      method="post"
      action="/newsletter"
      className={classes.newsletter}
    >
      <input
        type="email"
        placeholder="Sign up for newsletter..."
        aria-label="Sign up for newsletter"
      />
      <button>Sign up</button>
    </fetcher.Form>
  );
}

export default NewsletterSignup;
