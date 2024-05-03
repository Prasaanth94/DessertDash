SELECT * FROM users
SELECT * FROM shop
SELECT * FROM addresses
SELECT * FROM cart
SELECT * FROM product
SELECT * FROM checkout
SELECT * FROM roles


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE users
DROP TABLE roles
DROP TABLE shop
DROP TABLE product
DROP TABLE cart
DROP TABLE checkout
DROP TABLE ADDRESSES

DELETE FROM users
DELETE FROM shop
DELETE FROM addresses
DELETE FROM product
DELETE FROM cart
DELETE FROM checkout

DELETE FROM users WHERE user_id= '17755d83-0d38-4181-8382-ab25ffa12785'
DELETE FROM shop WHERE shop_id = '4e9ef4a5-45c0-4195-b2e8-74a6e948f89c';
DELETE FROM addresses WHERE shop_id = '4e9ef4a5-45c0-4195-b2e8-74a6e948f89c';
DELETE FROM cart WHERE cart_id ='add6d755-e4a0-4530-8ce3-47ccce01ef24'
DELETE FROM checkout WHERE user_id ='2484e2df-5593-4f0d-9cae-173aafcb1486'

CREATE TABLE users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    HASH VARCHAR(500) NOT NULL,
    username VARCHAR(50) NOT NULL,
    role_id INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);


CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE
);

CREATE TABLE shop (
    shop_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description VARCHAR(1000),
    business_owner_id UUID NOT NULL,
    closed BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (business_owner_id) REFERENCES users(user_id)
);

CREATE TABLE addresses (
    address_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    location VARCHAR(200),
    user_id UUID,
    shop_id UUID,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id)
);

CREATE TABLE product (
    product_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    shop_id UUID NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description VARCHAR(100),
    availability BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id)
);

CREATE TABLE cart (
    cart_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID ,
    quantity INT ,
    product_total_price DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE checkout (
    checkout_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INT NOT NULL,
    shop_id UUID NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id)
);



UPDATE users SET role_id=2 WHERE user_id='c85d7980-34f2-4ce7-b7ed-57f2ebb27e48'

ALTER TABLE cart
ADD COLUMN user_id UUID REFERENCES users(id);

ALTER TABLE cart
ALTER COLUMN product_id DROP NOT NULL;

ALTER TABLE cart
ALTER COLUMN product_total_price DROP NOT NULL;

ALTER TABLE cart
ADD CONSTRAINT unique_user_cart UNIQUE (user_id);

ALTER TABLE cart
ADD CONSTRAINT cart_unique_product_user UNIQUE (product_id, user_id);

INSERT INTO roles (role_name) VALUES ('user'), ('businessOwner'), ('admin');

SELECT u.user_id, u.email, u.username, r.role_name
FROM users u
JOIN roles r ON u.role_id = r.id;