import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import CartItems from "../components/CartItems";

const Cart = () => {
  const fetchData = useFetch();
  const [cart, setCart] = useState([]);
  const userCtx = useContext(UserContext);

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

  const checkCart = () => {
    console.log(cart);
    console.log(userCtx);
  };

  useEffect(() => {
    getCartItems();
  }, []);
  return (
    <>
      <NavBar></NavBar>
      <SideBar></SideBar>
      <div>Shopping Cart</div>
      <button onClick={checkCart}>Check</button>
      {cart.map((item, index) => (
        <CartItems
          key={index}
          product_name={item.product_name}
          price={item.price}
          description={item.description}
          quantity={item.quantity}
          totalPrice={item.product_total_price}
        />
      ))}
    </>
  );
};

export default Cart;
