import React, { useContext, useRef } from "react";
import styles from "./UpdateProductModal.module.css";
import ReactDom from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const nameRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const addProduct = async () => {
    const name = nameRef.current.value;
    const price = priceRef.current.value;
    const description = descriptionRef.current.value;
    try {
      const res = await fetchData(
        `/api/addProduct`,
        "PUT",
        {
          product_name: name,
          price: price,
          description: description,
        },
        userCtx.accessToken
      );

      if (!res.ok) {
        throw new Error("Failed to add product: ", res.statusText);
      }
      props.setAddProductModal(false);
      props.fetchProducts(props.shopId);
    } catch (error) {
      console.error("Cant add product: ", error);
    }
  };

  const handleClose = () => {
    props.setAddProductModal(false);
  };
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={`text-center ${styles.header}`}>
          <h4 className="modal-title">Add Product</h4>
        </div>
        <div className={styles.body}>
          <div className={`row ${styles.title}`}>
            <div className="col-md-1"></div>
            <div className="col-md-3">Product name</div>
            <input type="text" ref={nameRef} className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className={styles.body}>
            <div className={`row ${styles.title}`}>
              <div className="col-md-1"></div>
              <div className="col-md-3">Product Description</div>
              <textarea
                type="text"
                ref={descriptionRef}
                style={{ height: "250px" }}
                wrap="soft"
                className="col-md-6"
              />
              <div className="col-md-3"></div>
            </div>
            <div className={`row ${styles.title}`}>
              <div className="col-md-1"></div>
              <div className="col-md-3">Product Price</div>
              <input type="text" ref={priceRef} className="col-md-6" />
              <div className="col-md-3"></div>
            </div>

            <button onClick={addProduct}>Add</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddProductModal = (props) => {
  return (
    <>
      {ReactDom.createPortal(
        <OverLay
          setAddProductModal={props.setAddProductModal}
          fetchProducts={props.fetchProducts}
          shopId={props.shopId}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default AddProductModal;
