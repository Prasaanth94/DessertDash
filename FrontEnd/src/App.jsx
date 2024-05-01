import React, { useState, useEffect, useContext } from "react";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserContext from "./context/user";
import NavBar from "./components/NavBar";
import BusinessOwnerPage from "./pages/BusinessOwnerPage";
import { jwtDecode } from "jwt-decode";
import ShopPage from "./pages/ShopPage";
import Cart from "./pages/Cart";
import OrdersPage from "./pages/OrdersPage";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [loggedInId, setLoggedInId] = useState("");
  const [role, setRole] = useState("");
  const userCtx = useContext(UserContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      setRole(decoded.role);
      setLoggedInId(decoded.loggedInId);
      setAccessToken(accessToken);
      console.log(accessToken);
    }
  }, []);

  const userContextValue = {
    accessToken,
    setAccessToken,
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
          <Route path="/ShopPage/:shopId" element={<ShopPage />}></Route>
          <Route path="/Cart" element={<Cart />}></Route>
          <Route path="/OrdersPage" element={<OrdersPage />}></Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
