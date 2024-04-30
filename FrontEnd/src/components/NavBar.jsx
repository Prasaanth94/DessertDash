import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./NavBar.module.css";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const NavBar = ({ onSearch }) => {
  const userCtx = useContext(UserContext);
  const [roleUser, SetRoleUser] = useState("");
  const searchValueRef = useRef();

  const navigate = useNavigate();
  const fetchData = useFetch();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedInId");
    userCtx.setAccessToken("");
    userCtx.setRole("");
    userCtx.setLoggedInId("");
    navigate(`/`);
  };

  const handleSearch = () => {
    const searchValue = searchValueRef.current.value;

    onSearch(searchValue);
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
          <div>
            <input type="text" ref={searchValueRef}></input>
            <button className={styles.searchButton} onClick={handleSearch}>
              Search
            </button>
            <button type="submit" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.navbar} id={styles.businessOwnerNav}>
          <h3>Shop Logo</h3>
          <p>An icon will be here</p>

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
