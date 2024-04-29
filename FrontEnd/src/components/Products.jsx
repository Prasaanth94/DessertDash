import React from "react";
import styles from "./Product.module.css";

const Products = (props) => {
  return (
    <>
      <div className={styles.productContainer}>
        <div>{props.product_name}</div>
        <div>{props.description}</div>
        <div>{props.price}</div>
        <button type="submit">Update</button>
        <button type="submit">Toggle</button>
        <button type="submit">Delete</button>
      </div>
    </>
  );
};

export default Products;
