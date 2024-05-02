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

  const updateProduct = async () => {
    const product_name = nameRef.current.value;
    const description = descriptionRef.current.value;
    const price = priceRef.current.value;
    const product_id = props.product_id;

    try {
      console.log(product_id);
      console.log(userCtx.accessToken);
      console.log("price :", price);
      const res = await fetchData(
        `/api/updateProduct`,
        "PATCH",
        {
          product_name: product_name,
          description: description,
          price: price,
          product_id: product_id,
        },
        userCtx.accessToken
      );

      if (!res.ok) {
        throw new Error("Failed to update product : ", res.statusText);
      }
      props.setUpdateModal(false);
      props.fetchProducts();
    } catch (error) {
      console.error("Error updating Product: ", error);
    }
  };

  const handleClose = () => {
    props.setUpdateModal(false);
  };
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={`text-center ${styles.header}`}>
          <h4 className="modal-title">Product Update</h4>
        </div>
        <div className={styles.body}>
          <div className={`row ${styles.title}`}>
            <div className="col-md-1"></div>
            <div className="col-md-3">Product name</div>
            <input
              type="text"
              ref={nameRef}
              defaultValue={props.product_name}
              className="col-md-6"
            />
            <div className="col-md-3"></div>
          </div>

          <div className={styles.body}>
            <div className={`row ${styles.title}`}>
              <div className="col-md-1"></div>
              <div className="col-md-3">Product Description</div>
              <textarea
                type="text"
                ref={descriptionRef}
                defaultValue={props.description}
                style={{ height: "250px" }}
                wrap="soft"
                className="col-md-6"
              />
              <div className="col-md-3"></div>
            </div>
            <div className={`row ${styles.title}`}>
              <div className="col-md-1"></div>
              <div className="col-md-3">Product Price</div>
              <input
                type="text"
                ref={priceRef}
                defaultValue={props.price}
                className="col-md-6"
              />
              <div className="col-md-3"></div>
            </div>

            <button onClick={updateProduct}>Update</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateProductModal = (props) => {
  return (
    <>
      {ReactDom.createPortal(
        <OverLay
          setUpdateModal={props.setUpdateModal}
          product_id={props.product_id}
          product_name={props.product_name}
          description={props.description}
          price={props.price}
          fetchProducts={props.fetchProducts}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateProductModal;
