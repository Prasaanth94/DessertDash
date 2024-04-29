import React, { useContext, useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const userCtx = useContext(UserContext);
  const [roleUser, SetRoleUser] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedInId");
    userCtx.setAccessToken("");
    userCtx.setRole("");
    userCtx.setLoggedInId("");
    navigate(`/`);
  };

  useEffect(() => {
    if (userCtx.role === 1) {
      SetRoleUser(userCtx.role);
    }
  }, [userCtx.role]);

  return (
    <>
      {roleUser ? (
        <div className={styles.navbar}>
          <h3>Logo</h3>
          <p>An icon will be here</p>
          <input type="text"></input>
          <p>Search Icon to search</p>
        </div>
      ) : (
        <div className={styles.navbar} id={styles.businessOwnerNav}>
          <h3>Shop.Title</h3>
          <p>An icon will be here</p>
          <input type="text"></input>
          <p>Search Icon to search</p>
          <button type="submit" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default NavBar;
