import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import Products from "./Products";
import styles from "./ShopDetails.module.css";
import AddProductModal from "./AddProductModal";

const ShopDetails = (props) => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();
  const [products, setProducts] = useState();
  const [addProductModal, setAddProductModal] = useState(false);
  const shopId = props.shop.shop_id;
  console.log("Shop details Component: shopId: ", shopId);

  const fetchProducts = async (shopId) => {
    try {
      const res = await fetchData(
        `/api/getProducts?shop_id=${shopId}`,
        "GET",
        undefined,
        userCtx.accessToken
      );

      if (!res.ok) {
        const errorData = await res;
        throw new Error(`Failed to Fetch products ${errorData.msg} `);
      }
      console.log(res.data);
      setProducts(res.data);
    } catch (error) {
      console.error("Error getting shop: ", error);
    }
  };

  const handleAdd = () => {
    setAddProductModal(true);
  };

  useEffect(() => {
    fetchProducts(shopId);
  }, [shopId]);

  return (
    <>
      <div>
        <p>Title: {props.shop.title}</p>
        <p>Description: {props.shop.description}</p>
      </div>
      {products &&
        products.map((product) => (
          <Products
            key={product.product_id}
            product_id={product.product_id}
            product_name={product.product_name}
            description={product.description}
            price={product.price}
            fetchProducts={fetchProducts}
            shopId={shopId}
          ></Products>
        ))}
      <div className={styles.addButton}>
        <button onClick={handleAdd}>ADD Product</button>
        {addProductModal && (
          <AddProductModal
            setAddProductModal={setAddProductModal}
            fetchProducts={fetchProducts}
            shopId={shopId}
          ></AddProductModal>
        )}
      </div>
    </>
  );
};

export default ShopDetails;
