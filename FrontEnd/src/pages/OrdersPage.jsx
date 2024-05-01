import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import OrderItems from "../components/OrderItems";

const OrdersPage = () => {
  const fetchData = useFetch();
  const [orders, setOrders] = useState("");
  const userCtx = useContext(UserContext);

  const check = () => {
    console.log("userCtx: ", userCtx);
  };

  const getOrder = async () => {
    try {
      const res = await fetchData(
        "/api/getUserOrder",
        "GET",
        undefined,
        userCtx.accessToken
      );

      if (!res.ok) {
        throw new Error("error :", res.statusText);
      }

      console.log(res.data);
      setOrders(res.data.data);
    } catch (error) {
      console.error("Cant get orders :", error);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <>
      <NavBar></NavBar>
      <SideBar></SideBar>
      {orders.length === 0 ? (
        <div>No Orders</div>
      ) : (
        <OrderItems orders={orders}></OrderItems>
      )}
      <button onClick={check}>check</button>
    </>
  );
};

export default OrdersPage;
