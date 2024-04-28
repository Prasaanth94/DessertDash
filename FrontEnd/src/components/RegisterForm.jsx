import React, { useRef, useState } from "react";
import styles from "./LoginForm.module.css";
import useFetch from "../hooks/useFetch";

const RegisterForm = () => {
  const emailRef = useRef();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const roleRef = useRef();
  const [error, setError] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [allFields, setAllFields] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const fetchData = useFetch();

  const register = async (req, res) => {
    event.preventDefault();
    setPasswordMatch(false);
    const userEmailCheck = emailRef.current?.value;
    const passwordCheck = passwordRef.current?.value;
    const passwordConfirmCheck = passwordConfirmRef.current?.value;
    setIsloading(true);
    setPasswordMatch(false);
    setError("");

    if (!userEmailCheck || !passwordCheck || !passwordConfirmCheck) {
      setAllFields(true);
      throw new Error("Please fill in all fields.");
    }

    if (passwordCheck !== passwordConfirmCheck) {
      setPasswordMatch(true);

      throw new Error("Passwords Do Not Match!");
    }
    let roleNo;

    if (roleRef.current.value === "user") {
      roleNo = 1;
    }

    if (roleRef.current.value === "businessOwner") {
      roleNo = 2;
    }
    try {
      const res = await fetchData("/auth/register", "PUT", {
        email: emailRef.current.value,
        HASH: passwordRef.current.value,
        username: userNameRef.current.value,
        role: roleNo,
      });

      if (res.ok) {
        setIsloading(false);
        setAllFields(false);
        setAccountCreated(true);
      } else {
        setIsloading(false);
        setError(JSON.stringify(res.data));
        console.log(error);
      }
    } catch (error) {
      console.log("Error registering", error);
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

        <div className={styles.role}>
          <label>User Type:</label>
          <select ref={roleRef}>
            <option value="user">User</option>
            <option value="businessOwner">Business Owner</option>
          </select>
        </div>

        <button
          type="submit"
          className={styles.submit_button}
          onClick={register}
        >
          Register
        </button>
        {passwordMatch && <p>Passwords Do Not Match!</p>}
        {accountCreated && <p>Account Created!</p>}
        {isLoading && (
          <div className={styles.lds_ripple}>
            <div></div>
            <div></div>
          </div>
        )}
      </form>
    </>
  );
};

export default RegisterForm;
