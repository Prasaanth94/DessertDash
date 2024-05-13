const connectDB = require("../db/db");

const createShop = async (req, res) => {
  const {
    title,
    description,
    location,
    postal_code,
    address,
    unit,
    longitude,
    latitude,
    X,
    Y,
  } = req.body;
  const loggedInId = req.user.id;

  if (!title) {
    return res
      .status(400)
      .json({ status: "error", msg: "Please fill in the tile" });
  }

  try {
    const pool = await connectDB();

    const insertShopQuery = `INSERT INTO shop (title, business_owner_id, description) VALUES ($1, $2, $3)  RETURNING shop_id`;

    const result = await pool.query(insertShopQuery, [
      title,
      loggedInId,
      description,
    ]);

    if (result.rows.length > 0 && result.rows[0].shop_id) {
      const shopId = result.rows[0].shop_id;

      const insertAddressQuery = `INSERT INTO addresses (location, shop_id, postal_code, address, unit, longitude,latitude,x ,y) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
      await pool.query(insertAddressQuery, [
        location,
        shopId,
        postal_code,
        address,
        unit,
        longitude,
        latitude,
        X,
        Y,
      ]);

      res.status(200).json({ status: "Success", msg: "Shop Created" });
    } else {
      throw new Error("No rows returned form the insert Query");
    }
  } catch (error) {
    console.error("Error creating shop: ", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

const getShop = async (req, res) => {
  const { business_owner_id } = req.query;

  try {
    const pool = await connectDB();

    const getShopQuery = `SELECT * FROM shop where business_owner_id = $1`;
    const { rows } = await pool.query(getShopQuery, [business_owner_id]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Shop not found" });
    }

    const shop = rows[0];
    res.status(200).json(shop);
  } catch (error) {
    console.error("Cant get shop: ", error);
    res.status(400).json({ status: "errro", msg: "Internal Server Error" });
  }
};

const getShopByShopId = async (req, res) => {
  const { shop_id } = req.params;

  try {
    const pool = await connectDB();

    const getShopByIdQuery = `SELECT * FROM SHOP WHERE shop_id =$1`;
    const { rows } = await pool.query(getShopByIdQuery, [shop_id]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Shop not found" });
    }
    const shop = rows[0];
    res.status(200).json(shop);
  } catch (error) {
    console.error("Cant Get Shop: ", error);
    res.status(400).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const getShopByName = async (req, res) => {
  const { title } = req.params;

  try {
    const pool = await connectDB();

    const searchShopByNameQuery = `SELECT * FROM shop WHERE LOWER(title) LIKE '%' || LOWER($1) || '%' `;
    const { rows } = await pool.query(searchShopByNameQuery, [title]);

    if (rows.length === 0) {
      return res.status(400).json({ status: "error", msg: "No Shop Found" });
    }
    const shops = rows;
    res.status(200).json(shops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

const getNearByShop = async (req, res) => {
  const { userLongitude, userLatitude } = req.body;
  const radius = 5;

  try {
    // Establish a database connection
    console.log("Establishing database connection...");
    const pool = await connectDB();
    console.log("Database connection established.");

    // Query to retrieve shop coordinates
    console.log("Querying database for shop coordinates...");
    const searchNearbyShopQuery = `SELECT shop_id, longitude, latitude FROM addresses`;
    const { rows } = await pool.query(searchNearbyShopQuery);
    console.log("Shop coordinates retrieved:", rows);

    // Earth radius in kilometers
    const earthRadius = 6371;

    // Filter nearby shops
    console.log("Filtering nearby shops...");
    const nearbyShops = rows.filter((shop) => {
      const { latitude, longitude } = shop;

      // Convert shop's latitude and longitude from degrees to radians
      const lat2 = (latitude * Math.PI) / 180;
      const lon2 = (longitude * Math.PI) / 180;

      // Log the user's latitude and longitude for debugging
      console.log("User Latitude:", userLatitude);
      console.log("User Longitude:", userLongitude);

      // Log the shop's latitude and longitude for debugging
      console.log("Shop Latitude:", latitude);
      console.log("Shop Longitude:", longitude);

      // Haversine formula
      const dLat = lat2 - (userLatitude * Math.PI) / 180;
      const dLon = lon2 - (userLongitude * Math.PI) / 180;
      console.log("dLat:", dLat);
      console.log("dLon:", dLon);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLatitude * Math.PI) / 180) *
          Math.cos(lat2) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;

      // Check if the distance is within the radius
      console.log("Checking distance for shop:", shop);
      console.log("Distance:", distance);
      return distance <= radius;
    });

    const nearbyShopsIds = nearbyShops.map((shop) => shop.shop_id);
    const getNearByShopDetailsQuery = `SELECT * FROM shop WHERE shop_id IN (${nearbyShopsIds
      .map((id, index) => `$${index + 1}`)
      .join(",")})`;
    const { rows: shopDetails } = await pool.query(
      getNearByShopDetailsQuery,
      nearbyShopsIds
    );

    const nearbyShopsWithDetails = nearbyShops.map((shop) => ({
      ...shop,
      details: shopDetails.find((detail) => detail.shop_id === shop.shop_id),
    }));

    console.log("Nearby shops found:", nearbyShopsWithDetails);
    res.status(200).json(nearbyShopsWithDetails);
  } catch (error) {
    console.error("Error finding shops: ", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports = {
  createShop,
  getShop,
  getShopByName,
  getShopByShopId,
  getNearByShop,
};
