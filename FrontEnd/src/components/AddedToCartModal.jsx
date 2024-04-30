import React from "react";
import ReactDom from "react-dom";
import styles from "./AddedToCartModal.module.css";

const OverLay = (props) => {
  const handleClose = () => {
    props.setAddedToCartModal(false);
  };
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={`text-center ${styles.header}`}>
          <h4 className="modal-title">Succesfully Added to cart</h4>
        </div>
        <div className={styles.body}>
          <div className={`row ${styles.title}`}>
            <div className="col-md-1"></div>
            <div className="col-md-3"></div>
            <div>
              {props.quantity} X {props.name} have been added to cart
            </div>
            <div className="col-md-3"></div>
          </div>

          <div className={styles.body}>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddedToCartModal = (props) => {
  return (
    <>
      {ReactDom.createPortal(
        <OverLay
          setAddedToCartModal={props.setAddedToCartModal}
          name={props.name}
          price={props.price}
          quantity={props.quantity}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default AddedToCartModal;
