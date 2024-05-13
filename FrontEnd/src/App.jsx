import React, { useState, useEffect, useContext } from "react";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserContext from "./context/user";
import OnemapContext from "./context/onemap";
import NavBar from "./components/NavBar";
import BusinessOwnerPage from "./pages/BusinessOwnerPage";
import { jwtDecode } from "jwt-decode";
import ShopPage from "./pages/ShopPage";
import Cart from "./pages/Cart";
import OrdersPage from "./pages/OrdersPage";
import useOneMap from "./hooks/useOneMap";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [onemapAccessToken, setOnemapAccessToken] = useState("");
  const [loggedInId, setLoggedInId] = useState("");
  const [role, setRole] = useState("");
  const userCtx = useContext(UserContext);
  const onemapCtx = useContext(OnemapContext);
  const fetchOneMapData = useOneMap();

  // using my hook gives a CORS error
  // const getOneMapToken = async () => {
  //   try {
  //     const res = await fetchOneMapData(
  //       "/api/auth/post/getToken",
  //       "POST",
  //       {
  //         email: import.meta.env.VITE_ONE_MAP_EMAIL,
  //         password: import.meta.env.VITE_ONE_MAP_PASSWORD,
  //       } /* pass token if needed */
  //     );

  //     if (res.ok) {
  //       setOnemapAccessToken(res.data.access_token); // Assuming access_token is present in response data
  //     } else {
  //       throw new Error("Failed to get OneMap token: " + res.data); // Handle non-OK response
  //     }
  //   } catch (error) {
  //     throw new Error("Unable to access OneMap: " + error.message); // Catch and rethrow error
  //   }
  // };

  const getOneMapToken = async () => {
    try {
      const res = await fetch(
        "https://www.onemap.gov.sg/api/auth/post/getToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: import.meta.env.VITE_ONE_MAP_EMAIL,
            password: import.meta.env.VITE_ONE_MAP_PASSWORD,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setOnemapAccessToken(data.access_token);
      } else {
        throw new Error("Failed to get OneMap token");
      }
    } catch (error) {
      throw new Error("Unable to access OneMap: " + error.message);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      setRole(decoded.role);
      setLoggedInId(decoded.loggedInId);
      setAccessToken(accessToken);
    }
    getOneMapToken();
  }, []);

  const userContextValue = {
    accessToken,
    setAccessToken,
    role,
    setRole,
    loggedInId,
    setLoggedInId,
  };

  const onemapContextValue = {
    onemapAccessToken,
    setOnemapAccessToken,
  };

  const isLoggedIn = !!accessToken;
  const isBuisnessOwner = role === 2;

  return (
    <UserContext.Provider value={userContextValue}>
      <OnemapContext.Provider value={onemapContextValue}>
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
      </OnemapContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
