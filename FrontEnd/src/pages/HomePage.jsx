import React, { useContext } from "react";
import NavBar from "../components/NavBar";
import UserContext from "../context/user";

const HomePage = () => {
  const userCtx = useContext(UserContext);

  const check = () => {
    console.log(userCtx);
  };

  return (
    <>
      <NavBar></NavBar>
      <button type="submit" onClick={check}>
        Check
      </button>
    </>
  );
};

export default HomePage;
