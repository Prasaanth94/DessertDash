const connectDB = require("../db/db");

const userTable = async () => {
  const pool = await connectDB();

  try {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS users(
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        HASH VARCHAR(500) NOT NULL,
        username VARCHAR(50) NOT NULL,
        role VARCHAR(10) NOT NULL
    );`;
    await pool.query(createTableQuery);
    console.log("Table Created Succesfully");
  } catch (error) {
    console.error("Error creating error : ", error);
  }
};

module.exports = userTable;
