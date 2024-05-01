import React, { useState, useRef, useContext } from "react";
import styles from "./LoginForm.module.css";
import useFetch from "../hooks/useFetch";
import userContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const userCtx = useContext(userContext);

  const fetchData = useFetch();

  const login = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const HASH = passwordRef.current.value;

    try {
      const res = await fetchData("/auth/login", "POST", { email, HASH });

      if (res.ok) {
        const { access, refresh } = res.data;
        const decoded = jwtDecode(access);
        localStorage.setItem("accessToken", access);

        userCtx.setAccessToken(access);
        userCtx.setRole(decoded.role);
        userCtx.setLoggedInId(decoded.loggedInId);
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("login Error", error);
    }
  };

  return (
    <form className={styles.loginform}>
      <div className={styles.input_container}>
        <input
          type="text"
          id="email"
          ref={emailRef}
          className={`${styles.input} ${emailFocused ? styles.focused : ""}`}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          required
        />
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
      </div>
      <div className={styles.input_container}>
        <input
          type="password"
          id="password"
          ref={passwordRef}
          className={`${styles.input} ${passwordFocused ? styles.focused : ""}`}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          required
        />
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
      </div>
      <button type="submit" className={styles.submit_button} onClick={login}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
