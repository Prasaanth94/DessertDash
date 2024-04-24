const userModel = {
  id: "UUID DEFAULT uuid_generate_v4() PRIMARY KEY",
  email: "VARCHAR(100) NOT NULL",
  HASH: "VARCHAR(500) NOT NULL",
  username: "VARCHAR(50) NOT NULL",
  role: "VARCHAR(20) NOT NULL",
  active: "BOOLEAN NOT NULL DEFAULT true",
};

module.exports = userModel;
