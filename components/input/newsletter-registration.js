import classes from "./newsletter-registration.module.css";
import { useRef, useContext } from "react";
import NotificationContext from "../../store/notification-context";
function NewsletterRegistration() {
  // fetch user input (state or refs)
  // optional: validate input
  // send valid data to API
  const emailInputRef = useRef();
  const notificationCtx = useContext(NotificationContext);

  function registrationHandler(event) {
    event.preventDefault();
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (
      !emailInputRef.current.value ||
      !emailInputRef.current.value.match(pattern)
    ) {
      alert("Please enter a valid email");
    }
    notificationCtx.showNotification({
      title: "Signing Up",
      message: "Registering for newsletter",
      status: "pending",
    });
    fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email: emailInputRef.current.value }),
      header: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        res.json().then((data) => {
          throw new Error(data.message || "Something went wrong");
        });
      })
      .then((data) => {
        notificationCtx.showNotification({
          title: "Success",
          message: "Successfully Registered",
          status: "success",
        });
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "Error",
          message: error.message || "Something went wrong",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type='email'
            id='email'
            placeholder='Your email'
            aria-label='Your email'
            ref={emailInputRef}
          />
          <button type='submit'>Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
