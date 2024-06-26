import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import OrderItems from "../components/OrderItems";
import styles from "./OrderPage.module.css";

const OrdersPage = () => {
  const fetchData = useFetch();
  const [orders, setOrders] = useState("");
  const userCtx = useContext(UserContext);
  let businessOwnerId = null;
  let userId = null;
  const role = userCtx.role;
  const [shop, setShop] = useState("");

  if (userCtx.role === 2) {
    businessOwnerId = userCtx.loggedInId;
  }

  if (userCtx.role === 1) {
    userId = userCtx.loggedInId;
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
    } catch (error) {
      console.error("error getting shop", error);
    }
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

      setOrders(res.data.data);
    } catch (error) {
      console.error("Cant get orders :", error);
    }
  };

  const getOrderByShopId = async () => {
    if (!shop || !shop.shop_id) {
      console.error("Shop is not available");
      return;
    }
    const shop_id = shop.shop_id;

    try {
      const res = await fetchData(
        `/api/getOwnerOrder/${shop_id}`,
        "GET",
        undefined,
        userCtx.accessToken
      );

      if (!res.ok) {
        throw new Error("error :", res.statusText);
      }
      console.log("res.data: ", res.data.data);
      setOrders(res.data.data);
    } catch (error) {
      console.error("Cant get orders :", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getOrder();
    } else if (businessOwnerId) {
      fetchShop(businessOwnerId);
    }
  }, [userCtx]);
  useEffect(() => {
    if (shop.shop_id) {
      getOrderByShopId();
    }
  }, [shop]);

  return (
    <>
      <NavBar />
      <SideBar />
      {role === 1 ? (
        <>
          {orders.length === 0 ? (
            <div className={styles.noOrder}>No Orders</div>
          ) : (
            <OrderItems
              orders={orders}
              role={role}
              getOrderByShopId={getOrderByShopId}
              shopId={shop.shop_id}
            />
          )}
        </>
      ) : (
        <>
          {Object.keys(orders).length === 0 ? (
            <div className={styles.noOrder}>No Orders</div>
          ) : (
            <div className={styles.centeredContent}>
              <>
                {Object.keys(orders).map((userId) => (
                  <div key={userId} className={styles.orderReceipt}>
                    <h2>Customer: {userId}</h2>
                    <OrderItems
                      orders={orders[userId]}
                      role={role}
                      getOrderByShopId={getOrderByShopId}
                      shopId={shop.shop_id}
                    />
                    <button>Collected</button>
                  </div>
                ))}
              </>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OrdersPage;
