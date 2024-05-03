import React, { useState, useContext, useEffect } from "react";
import NavBar from "../components/NavBar";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import ShopDetails from "../components/ShopDetails";
import CreateShopModal from "../components/CreateShopModal";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";

const BusinessOwnerPage = () => {
  const [shop, setShop] = useState("");
  const [error, setError] = useState(null);
  const [createShopModal, setCreateShopModal] = useState(false);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const businessOwnerId = userCtx.loggedInId;
  if (businessOwnerId === null) {
    navigate(`/`);
  }

  const fetchShop = async (businessOwnerId) => {
    try {
      const res = await fetchData(
        `/api/getShop?business_owner_id=${businessOwnerId}`,
        "GET"
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch shop ${res.statusText}`);
      }

      setShop(res.data);
      console.log("shop :", shop);
    } catch (error) {
      console.error("error getting shop", error);
    }
  };

  const handleSetUp = () => {
    setCreateShopModal(true);
  };

  useEffect(() => {
    fetchShop(businessOwnerId);
  }, [userCtx]);
  return (
    <>
      <NavBar></NavBar>
      <SideBar></SideBar>
      {shop ? (
        <ShopDetails shop={shop} fetchShop={fetchShop}></ShopDetails>
      ) : (
        <div>
          <p>Welcome To DessertDash</p>
          <p>Set Up Your Shop Here</p>
          <button type="submit" onClick={handleSetUp}>
            Set Up
          </button>
        </div>
      )}

      {createShopModal && (
        <CreateShopModal
          setCreateShopModal={setCreateShopModal}
          fetchShop={fetchShop}
        ></CreateShopModal>
      )}
    </>
  );
};

export default BusinessOwnerPage;
