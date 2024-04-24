const productModel = {
  id: "UUID DEFAULT uuid_generate_v4() PRIMARY KEY",
  shop_id: "UUID",
  product_name: "VARCHAR(100)",
  price: "DECIMAL(10,2)",
  desription: "VARCHAR(100)",
  availability: "BOOLEAN NOT NULL DEFAULT true",
};
