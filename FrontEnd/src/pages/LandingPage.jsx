import React from "react";
import styles from "./LandingPage.module.css";
import LoginForm from "../components/LoginForm";

const LandingPage = () => {
  return (
    <>
      <div className={styles.landingpage}>
        <img
          className={styles.landingpage_img}
          src="../public/landingpage_img.jpg"
          alt="Landing Page Image"
        />
        <div className={styles.form_container}>
          <LoginForm></LoginForm>
          <p className={styles.clickToReg}>Not a user yet? Register Here!</p>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
