import React, { useContext, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import ShopCard from "../components/ShopCard";
import SideBar from "../components/SideBar";

const HomePage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [searchShop, setSearchShop] = useState("");
  const [shops, setShops] = useState([]);

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

  useEffect(() => {
    if (searchShop) {
      searchShopByName();
    }
  }, [searchShop]);

  return (
    <>
      <NavBar onSearch={handleSearch}></NavBar>
      <SideBar></SideBar>
      {shops && (
        <>
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
