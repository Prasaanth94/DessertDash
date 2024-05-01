import React from "react";
import styles from "./CartItems.module.css";

const CartItems = (props) => {
  return (
    <>
      <div className={styles.productContainer}>
        <div>{props.product_name}</div>
        <div>{props.description}</div>
        <div>${props.price}</div>
        <div>{props.quantity}</div>
        <div>{props.totalPrice}</div>
      </div>
    </>
  );
};

export default CartItems;
