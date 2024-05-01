import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Products from "../components/Products";
import SideBar from "../components/SideBar";

const ShopPage = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState([]);
  const [products, setProducts] = useState([]);
  console.log("Shopid: ", shopId);
  const fetchData = useFetch();

  const fetchShop = async () => {
    try {
      const res = await fetchData(`/api/getShopById/${shopId}`, "GET");

      if (!res.ok) {
        throw new Error("Error searching shop", res.statusText);
      }
      const data = res.data;

      setShop(data);
    } catch (error) {
      console.error("Cant find shop: ", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetchData(`/api/getProducts?shop_id=${shopId}`, "GET");

      if (!res.ok) {
        const errorData = await res;
        throw new Error(`Failed to Fetch products ${errorData.msg} `);
      }

      setProducts(res.data);
      console.log("res: ", res);
    } catch (error) {
      console.error("Error getting shop: ", error);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchShop();
      fetchProducts();
    }
  }, [shopId]);
  return (
    <>
      <NavBar></NavBar>
      <SideBar></SideBar>
      <div>
        <h1>{shop.title}</h1>
        <p>{shop.description}</p>
      </div>
      {products.map((product) => (
        <Products
          product_name={product.product_name}
          price={product.price}
          description={product.description}
          product_id={product.product_id}
          key={product.product_id}
        />
      ))}
    </>
  );
};

export default ShopPage;
