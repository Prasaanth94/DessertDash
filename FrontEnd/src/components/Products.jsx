import React, { useContext, useState } from "react";
import styles from "./Product.module.css";
import UpdateProductModal from "./UpdateProductModal";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import AddedToCartModal from "./AddedToCartModal";

const Products = (props) => {
  const [updateModal, setUpdateModal] = useState(false);
  const [addedToCartModal, setAddedToCartModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const businessOwner = userCtx.role === 2;

  const handleUpdate = () => {
    setUpdateModal(true);
  };

  const deleteProduct = async () => {
    const product_id = props.product_id;

    try {
      console.log("product_id: ", product_id);
      const res = await fetchData(
        `/api/deleteProduct?product_id=${product_id}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (!res.ok) {
        throw new Error("Cant delete product :", res.statusText);
      }
      props.fetchProducts(props.shopId);
    } catch (error) {
      console.error("Cant delete Product: ", error);
    }
  };

  const addToCart = async () => {
    const product_id = props.product_id;
    const price = props.price;
    try {
      const res = await fetchData(
        `/api/addToCart`,
        "PUT",
        {
          product_id: product_id,
          quantity: quantity,
          product_price: price,
        },
        userCtx.accessToken
      );

      if (!res.ok) {
        throw new Error("Cant add to cart: ", res.statusText);
      }
      setAddedToCartModal(true);
    } catch (error) {
      console.error("Unable to add to cart: ", error);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  return (
    <>
      {businessOwner ? (
        <div className={styles.productContainer}>
          <div>{props.product_name}</div>
          <div>{props.description}</div>
          <div>${props.price}</div>
          <button type="submit" onClick={handleUpdate}>
            Update
          </button>
          <button type="submit">Toggle</button>
          <button type="submit" onClick={deleteProduct}>
            Delete
          </button>
        </div>
      ) : (
        <div>
          <div className={styles.productContainer}>
            <div>{props.product_name}</div>
            <div>{props.description}</div>
            <div>${props.price}</div>
            <label htmlFor="quantity">Quantity:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
            >
              {[...Array(10).keys()].map((index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <button onClick={addToCart}>Add To Cart</button>
          </div>
        </div>
      )}
      {addedToCartModal && (
        <AddedToCartModal
          setAddedToCartModal={setAddedToCartModal}
          price={props.price}
          name={props.product_name}
          quantity={quantity}
        ></AddedToCartModal>
      )}
      {updateModal && (
        <UpdateProductModal
          product_id={props.product_id}
          product_name={props.product_name}
          description={props.description}
          price={props.price}
          fetchProducts={props.fetchProducts}
          setUpdateModal={setUpdateModal}
        />
      )}
    </>
  );
};

export default Products;
