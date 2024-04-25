import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserContext from "./context/user";
import NavBar from "./components/NavBar";
import BusinessOwnerPage from "./pages/BusinessOwnerPage";

function App() {
  const [accessToken, setAccesToken] = useState("");
  const [loggedInId, setLoggedInId] = useState("");
  const [role, setRole] = useState("");

  const userContextValue = {
    accessToken,
    setAccesToken,
    role,
    setRole,
    loggedInId,
    setLoggedInId,
  };

  const isLoggedIn = !!accessToken;
  const isBuisnessOwner = role === 2;

  return (
    <UserContext.Provider value={userContextValue}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                isBuisnessOwner ? (
                  <Navigate to="/BusinessOwnerPage" />
                ) : (
                  <Navigate to="/HomePage" />
                )
              ) : (
                <LandingPage />
              )
            }
          />
          <Route path="/HomePage" element={<HomePage />}></Route>
          <Route
            path="/BusinessOwnerPage"
            element={<BusinessOwnerPage />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
