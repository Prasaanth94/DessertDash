import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import CartItems from "../components/CartItems";
import styles from "./Cart.module.css";

const Cart = () => {
  const fetchData = useFetch();
  const [cart, setCart] = useState([]);
  const userCtx = useContext(UserContext);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const getCartItems = async (req, res) => {
    try {
      const res = await fetchData(
        `/api/getCart`,
        "GET",
        undefined,
        userCtx.accessToken
      );

      if (!res.ok) {
        throw new Error("Cant get cart: ", res.statusText);
      }
      setCart(res.data.row);
      console.log(res.data);
    } catch (error) {
      console.error("Cant Fetch Cart: ", error);
    }
  };
  const checkOut = async (selectedProductIds) => {
    console.log(selectedProducts);
    try {
      const response = await fetchData(
        "/api/moveToOrder",
        "POST",
        {
          product_ids: selectedProductIds,
        },
        userCtx.accessToken
      );

      if (!response.ok) {
        throw new Error("Error: " + response.statusText);
      }

      getCartItems();
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  const handleToggleProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleCheckOut = () => {
    console.log(selectedProducts);
    if (selectedProducts.length > 0) {
      checkOut(selectedProducts);
    }
  };

  const checkCart = () => {
    console.log(cart);
    console.log(userCtx);
  };

  useEffect(() => {
    getCartItems();
  }, [userCtx]);
  return (
    <>
      <NavBar></NavBar>
      <SideBar></SideBar>
      <div>Shopping Cart</div>

      {cart.length === 0 ? (
        <div className={`container`}>
          <div className={styles.text}>Your cart is empty.</div>
        </div>
      ) : (
        <>
          {cart.map((item, index) => (
            <CartItems
              key={index}
              product_id={item.product_id}
              product_name={item.product_name}
              price={item.price}
              description={item.description}
              quantity={item.quantity}
              totalPrice={item.product_total_price}
              onToggleProduct={handleToggleProduct}
            />
          ))}
          <div className={styles.buttonContainer}>
            <button onClick={handleCheckOut} className={styles.checkOutButton}>
              Checkout Selected Items
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
