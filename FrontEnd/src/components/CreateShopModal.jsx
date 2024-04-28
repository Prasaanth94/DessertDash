import React from "react";
import ReactDom from "react-dom";
import styles from "./CreateShopModal.module.css";

const OverLay = (props) => {
  const handleClose = () => {
    props.setCreateShopModal(false);
  };
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={`text-center ${styles.header}`}>
          <h4 className="modal-title">Update Profile</h4>
        </div>
        <div className={styles.body}>
          <div className={`row ${styles.title}`}>
            <div className="col-md-1"></div>
            <div className="col-md-3">Username</div>
            <input type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>
          <button>Update</button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const CreateShopModal = (props) => {
  return (
    <>
      {ReactDom.createPortal(
        <OverLay setCreateShopModal={props.setCreateShopModal}></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default CreateShopModal;
