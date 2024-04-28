import React, { useState } from "react";
import NavBar from "../components/NavBar";
import useFetch from "../hooks/useFetch";

const BusinessOwnerPage = () => {
  const [shop, setShop] = useState(null);
  const [error, setErrot] = useState(null);
  const fetchData = useFetch();

  const fetchShop = async (req, res) => {};
  return (
    <>
      <NavBar></NavBar>
      <p>Business owner page</p>
    </>
  );
};

export default BusinessOwnerPage;
