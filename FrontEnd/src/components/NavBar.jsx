import React, { useContext, useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import userContext from "../context/user";

const NavBar = () => {
  const userCtx = useContext(userContext);
  const [roleUser, SetRoleUser] = useState("");

  useEffect(() => {
    if (userCtx.role === "user") {
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
        </div>
      )}
    </>
  );
};

export default NavBar;
