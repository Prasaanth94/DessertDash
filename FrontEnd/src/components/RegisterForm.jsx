import React, { useRef, useState } from "react";
import styles from "./LoginForm.module.css";

const RegisterForm = () => {
  const emailRef = useRef();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [allFields, setAllFields] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const register = () => {
    event.preventDefault();
    setPasswordMatch(false);
    const userEmailCheck = emailRef.current?.value;
    const passwordCheck = passwordRef.current?.value;
    const passwordConfirmCheck = passwordConfirmRef.current?.value;

    if (!userEmailCheck || !passwordCheck || !passwordConfirmCheck) {
      setAllFields(true);
      throw new Error("Please fill in all fields.");
    }

    if (passwordCheck !== passwordConfirmCheck) {
      setPasswordMatch(true);

      throw new Error("Passwords Do Not Match!");
    }

    try {
      setIsloading(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form className={styles.loginform}>
        <div className={styles.input_container}>
          <input
            type="text"
            id="email"
            ref={emailRef}
            className={styles.input}
            required
          />
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
        </div>
        <div className={styles.input_container}>
          <input
            type="text"
            id="username"
            ref={userNameRef}
            className={styles.input}
            required
          />
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
        </div>
        <div className={styles.input_container}>
          <input
            type="password"
            id="password"
            ref={passwordRef}
            className={styles.input}
            required
          />
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
        </div>
        <div className={styles.input_container}>
          <input
            type="password"
            id="passwordcheck"
            ref={passwordConfirmRef}
            className={styles.input}
            required
          />
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
        </div>

        <button
          type="submit"
          className={styles.submit_button}
          onClick={register}
        >
          Register
        </button>
        {passwordMatch && <p>Passwords Do Not Match!</p>}
        {isLoading && (
          <div class={styles.lds_ripple}>
            <div></div>
            <div></div>
          </div>
        )}
      </form>
    </>
  );
};

export default RegisterForm;
