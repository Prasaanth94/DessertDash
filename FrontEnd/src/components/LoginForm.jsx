import React from "react";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  return (
    <form className={styles.loginform}>
      <div className={styles.input_container}>
        <input type="text" id="email" className={styles.input} required />
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
      </div>
      <div className={styles.input_container}>
        <input
          type="password"
          id="password"
          className={styles.input}
          required
        />
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
      </div>
      <button type="submit" className={styles.submit_button}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
