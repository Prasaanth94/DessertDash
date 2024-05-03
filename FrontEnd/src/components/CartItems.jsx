import React, { useState, useEffect } from "react";
import styles from "./CartItems.module.css";

const CartItems = ({
  product_name,
  price,
  description,
  quantity,
  totalPrice,
  product_id,
  onToggleProduct,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  // Update isChecked when productId changes
  useEffect(() => {
    setIsChecked(false); // Reset checkbox state when productId changes
  }, [product_id]);

  const handleToggleProduct = () => {
    setIsChecked(!isChecked);
    onToggleProduct(product_id);
  };

  return (
    <div className={styles.productContainer}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggleProduct}
      />
      <div>{product_name}</div>
      <div>{description}</div>
      <div>${price}</div>
      <div>{quantity}</div>
      <div>{totalPrice}</div>
    </div>
  );
};

export default CartItems;
