import React from "react";
import styles from "./ShopCard.module.css";
import { useNavigate } from "react-router-dom";

const ShopCard = (props) => {
  const navigate = useNavigate();
  console.log(props.shop_id);

  const handleClick = (event) => {
    event.preventDefault();
    const shopId = props.shop_id;
    navigate(`/ShopPage/${shopId}`);
  };

  return (
    <div className={`container`}>
      <div className={styles.shopCard} onClick={handleClick}>
        <h2 className={styles.shopTitle}>{props.title}</h2>
        <p className={styles.shopDescription}>{props.description}</p>
      </div>
    </div>
  );
};

export default ShopCard;
