import React from "react";

const ShopDetails = (props) => {
  console.log(props);
  return (
    <div>
      <p>Title: {props.shop.title}</p>
      <p>Description: {props.shop.description}</p>
    </div>
  );
};

export default ShopDetails;
