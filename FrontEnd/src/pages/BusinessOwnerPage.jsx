import React, { useState, useContext, useEffect } from "react";
import NavBar from "../components/NavBar";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import ShopDetails from "../components/ShopDetails";

const BusinessOwnerPage = () => {
  const [shop, setShop] = useState("");
  const [error, setError] = useState(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const businessOwnerId = userCtx.loggedInId;
  console.log(userCtx);
  console.log("business: ", businessOwnerId);
  const fetchShop = async (businessOwnerId) => {
    try {
      const res = await fetchData(
        `/api/getShop?business_owner_id=${businessOwnerId}`,
        "GET"
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch shop ${res.statusText}`);
      }
      console.log("res.data: ", res.data);
      console.log("shop :", shop);
      setShop(res.data);
    } catch (error) {
      console.error("error getting shop", error);
    }
  };

  useEffect(() => {
    fetchShop(businessOwnerId);
  }, [businessOwnerId]);
  return (
    <>
      <NavBar></NavBar>
      {shop ? <ShopDetails shop={shop}></ShopDetails> : <p>create shop</p>}
    </>
  );
};

export default BusinessOwnerPage;
