import React, { useContext, useRef } from "react";
import ReactDom from "react-dom";
import styles from "./CreateShopModal.module.css";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const locationRef = useRef();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const createShop = async () => {
    console.log(userCtx);
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const location = locationRef.current.value;
    try {
      const res = await fetchData(
        "/api/createShop",
        "PUT",
        { title, description, location },
        userCtx.accessToken
      );

      if (res.ok) {
        props.setCreateShopModal(false);
        props.fetchShop();
      }
    } catch (error) {
      console.error("Error setting up shop: ", error);
    }
  };

  const handleClose = () => {
    props.setCreateShopModal(false);
  };
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={`text-center ${styles.header}`}>
          <h4 className="modal-title">Set Up Shop</h4>
        </div>
        <div className={styles.body}>
          <div className={`row ${styles.title}`}>
            <div className="col-md-1"></div>
            <div className="col-md-3">Shop Name</div>
            <input type="text" ref={titleRef} className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className={styles.body}>
            <div className={`row ${styles.title}`}>
              <div className="col-md-1"></div>
              <div className="col-md-3">Shop Description</div>
              <textarea
                ref={descriptionRef}
                type="text"
                style={{ height: "250px" }}
                wrap="soft"
                className="col-md-6"
              />
              <div className="col-md-3"></div>
            </div>
            <div className={`row ${styles.title}`}>
              <div className="col-md-1"></div>
              <div className="col-md-3">Location</div>
              <input type="text" ref={locationRef} className="col-md-6" />
              <div className="col-md-3"></div>
            </div>

            <button onClick={createShop}>Update</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateShopModal = (props) => {
  return (
    <>
      {ReactDom.createPortal(
        <OverLay
          setCreateShopModal={props.setCreateShopModal}
          fetchShop={props.fetchShop}
        ></OverLay>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default CreateShopModal;
