import React, { useContext, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import UserContext from "../context/user";
import OnemapContext from "../context/onemap";
import useFetch from "../hooks/useFetch";
import ShopCard from "../components/ShopCard";
import SideBar from "../components/SideBar";

const HomePage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const onemapCtx = useContext(OnemapContext);
  const [searchShop, setSearchShop] = useState("");
  const [shops, setShops] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              success(position);
              resolve();
            },
            (err) => {
              error(err);
              reject(`Unable to retrieve location.`);
            }
          );
        }
      } catch (error) {
        console.error(error.message);
        reject(`Error: ${error.message}`);
      }
    });
  };

  const success = (position) => {
    const latitude = parseFloat(position.coords.latitude);
    const longitude = parseFloat(position.coords.longitude);
    setLatitude(latitude);
    setLongitude(longitude);
  };

  const error = (err) => {
    console.error(err.message);
  };

  const handleSearch = (value) => {
    setSearchShop(value);
  };

  const searchShopByName = async () => {
    const title = searchShop;

    try {
      //   const res = await fetchData(`/api/getShopByName?title=${title}`, "GET");
      const res = await fetchData(`/api/getShopByName/${title}`, "GET");

      if (!res.ok) {
        throw new Error("Error searching shop", res.statusText);
      }
      const data = res.data;
      console.log(data);
      setShops(data);
    } catch (error) {
      console.error("Cant find shop: ", error);
    }
  };

  const getNearbyShops = async () => {
    console.log("latitude: ", latitude);
    console.log("Longitdue: ", longitude);
    try {
      const res = await fetchData(
        "/api/getNearByShop",
        "POST",
        {
          userLongitude: longitude,
          userLatitude: latitude,
        },
        userCtx.accessToken
      );

      if (!res.ok) {
        console.log("res:", res);
        throw new Error("Error getting nearby shops :", res.statusText);
      }
      const shops = res.data; // Assuming res.data is an array of shops
      const detailsArray = shops.map((shop) => shop.details);
      console.log("nearbyshops: ", shops);
      setShops(detailsArray);
    } catch (error) {
      console.error("Cant find nearyby shops: ", error);
    }
  };

  useEffect(() => {
    getNearbyShops();
  }, [latitude, longitude]);

  useEffect(() => {
    if (searchShop) {
      searchShopByName();
    }
  }, [searchShop]);

  useEffect(() => {
    getLocation()
      .then(() => {
        console.log("Location retrieved successfully.");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const checkLocation = () => {
    console.log("Longitude: ", longitude);
    console.log("Latitude: ", latitude);
    console.log(onemapCtx.onemapAccessToken);
    console.log("shop: ", shops);
  };

  return (
    <>
      <NavBar onSearch={handleSearch}></NavBar>
      <SideBar></SideBar>
      {shops && (
        <>
          <button onClick={checkLocation}>Check</button>
          {shops.map((shop) => (
            <ShopCard
              key={shop.shop_id}
              shop_id={shop.shop_id}
              title={shop.title}
              description={shop.description}
            ></ShopCard>
          ))}
        </>
      )}
    </>
  );
};

export default HomePage;
