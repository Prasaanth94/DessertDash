import React, { useContext } from "react";
import styles from "./OrderItems.module.css";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OrderItems = ({ orders, role, getOrderByShopId, shopId }) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const orderCollected = async (product_id) => {
    try {
      const res = await fetchData(
        `/api/orderCollected/${product_id}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (!res.ok) {
        throw new Error("error", res.statusText);
      }
      alert("Order collected successfully!");
      console.log("shopId", shopId);
      getOrderByShopId(shopId);
    } catch (error) {
      console.error("Cant remove error", error);
    }
  };

  return (
    <div>
      {role === 1 &&
        orders.map((order, index) => (
          <div className={styles.productContainer} key={index}>
            <div>{order.shop.title}</div>
            <div>{order.product.product_name}</div>
            <div>${order.product.price}</div>
            <div>{order.quantity}</div>
            <div>{order.total_price}</div>
          </div>
        ))}
      {role === 2 &&
        orders.map((order, index) => (
          <div className={styles.productContainer} key={index}>
            <div>{order.productName}</div>
            <div>${order.price}</div>
            <div>{order.quantity}</div>
            <div>{order.total_price}</div>
            <div>{new Date(order.checkout_date).toLocaleString()}</div>
            <button onClick={() => orderCollected(order.product_id)}>
              collected
            </button>
          </div>
        ))}
    </div>
  );
};

export default OrderItems;
