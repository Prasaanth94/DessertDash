import React, { useState } from "react";
import styles from "./LandingPage.module.css";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const LandingPage = () => {
  const [loginForm, setLoginForm] = useState(true);
  const [registerForm, setRegisterForm] = useState(false);

  const handleForm = () => {
    if (loginForm) {
      setLoginForm(false);
      setRegisterForm(true); // Set registerForm to true when switching from login form to register form
    } else if (!loginForm) {
      setLoginForm(true);
      setRegisterForm(false);
    }
  };

  return (
    <>
      <div className={styles.landingpage}>
        <img
          className={styles.landingpage_img}
          src="../public/landingpage_img.jpg"
          alt="Landing Page Image"
        />
        <div className={styles.form_container}>
          {loginForm ? (
            <>
              <LoginForm></LoginForm>
              <p className={styles.clickToReg} onClick={handleForm}>
                Not a user yet? Register Here!
              </p>
            </>
          ) : (
            <>
              <RegisterForm></RegisterForm>
              <p className={styles.clickToReg} onClick={handleForm}>
                Already have an account? Login here!
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
