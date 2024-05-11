import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import styles from "./CreateShopModal.module.css";
import useFetch from "../hooks/useFetch";
import useOneMapFetch from "../hooks/useOneMap";
import UserContext from "../context/user";
import OnemapContext from "../context/onemap";

const OverLay = (props) => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const locationRef = useRef();
  const addressRef = useRef();
  const unitRef = useRef();
  const postal_codeRef = useRef();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [X, setX] = useState("");
  const [Y, setY] = useState("");
  const fetchData = useFetch();
  const fetchOneMapData = useOneMapFetch();

  const userCtx = useContext(UserContext);
  const onemapCtx = useContext(OnemapContext);

  const check = () => {
    console.log("latitude: ", latitude);
    console.log("Longitude: ", longitude);
    console.log("X: ", X);
    console.log("Y: ", Y);
  };

  const getGeoLocation = async () => {
    const postal_code = postal_codeRef.current.value;
    console.log(postal_code);
    try {
      const areaRes = await fetch(
        `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postal_code}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
      );

      if (areaRes.ok) {
        const data = await areaRes.json();
        console.log(data.results[0]);

        const { LATITUDE, LONGITUDE, X, Y } = data?.results[0];

        if (LATITUDE && LONGITUDE) {
          setLatitude(LATITUDE);
          setLongitude(LONGITUDE);
          setX(X);
          setY(Y);
        } else {
          console.error("Latitude and longitude not found in the response.");
        }
      } else {
        console.error("Request failed with status:", areaRes.status);
      }
    } catch (error) {
      console.error("Error fetching longitude and latitude:", error);
    }
  };

  const createShop = async () => {
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const location = locationRef.current.value;
    const address = addressRef.current.value;
    const unit = unitRef.current.value;
    const postal_code = postal_codeRef.current.value;
    try {
      const res = await fetchData(
        "/api/createShop",
        "PUT",
        {
          title,
          description,
          location,
          address,
          unit,
          postal_code,
          longitude,
          latitude,
          X,
          Y,
        },
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

  useEffect(() => {
    if (latitude !== "" && longitude !== "") {
      createShop();
    }
  }, [longitude, latitude]);
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
            <div className={`row ${styles.title}`}>
              <div className="col-md-1"></div>
              <div className="col-md-3">Address</div>
              <input type="text" ref={addressRef} className="col-md-6" />
              <div className="col-md-3"></div>
            </div>
            <div className={`row ${styles.title}`}>
              <div className="col-md-1"></div>
              <div className="col-md-3">Unit No.</div>
              <input type="text" ref={unitRef} className="col-md-6" />
              <div className="col-md-3"></div>
            </div>
            <div className={`row ${styles.title}`}>
              <div className="col-md-1"></div>
              <div className="col-md-3">Postal Code</div>
              <input type="text" ref={postal_codeRef} className="col-md-6" />
              <div className="col-md-3"></div>
            </div>

            <button onClick={getGeoLocation}>Create</button>
            <button onClick={handleClose}>Close</button>
            <button onClick={check}>Check</button>
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
