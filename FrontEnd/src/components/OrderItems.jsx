import React from "react";
import styles from "./OrderItems.module.css";

const OrderItems = ({ orders }) => {
  return (
    <div>
      {orders.map((order, index) => (
        <div className={styles.productContainer} key={index}>
          <div>{order.product.product_name}</div>
          <div>{order.product.description}</div>
          <div>${order.product.price}</div>
          <div>{order.quantity}</div>
          <div>{order.totalPrice}</div>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
