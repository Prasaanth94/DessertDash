import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./NavBar.module.css";
import UserContext from "../context/user";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const NavBar = ({ onSearch }) => {
  const userCtx = useContext(UserContext);
  const [roleUser, SetRoleUser] = useState("");
  const searchValueRef = useRef();

  const navigate = useNavigate();
  const fetchData = useFetch();

  const location = useLocation();

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
          <h3 className={styles.logo}>DessertDash</h3>

          {/* Render search input and button only on the home page */}
          {location.pathname === "/HomePage" && (
            <div>
              <input type="text" ref={searchValueRef}></input>
              <button className={styles.searchButton} onClick={handleSearch}>
                Search
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.navbar} id={styles.businessOwnerNav}>
          <h3>Shop Logo</h3>
          <p>An icon will be here</p>

          <p>Search Icon to search</p>
        </div>
      )}
    </>
  );
};

export default NavBar;
