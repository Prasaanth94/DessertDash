SELECT * FROM users
SELECT * FROM shop
SELECT * FROM addressess
SELECT * FROM product


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE users
DROP TABLE roles
DROP TABLE shop


CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    HASH VARCHAR(500) NOT NULL,
    username VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);

DELETE FROM users
DELETE FROM shop
DELETE FROM addressess

CREATE TABLE roles (
	id SERIAL PRIMARY KEY
)

CREATE TABLE shop(
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	title VARCHAR(500) NOT NULL,
	description VARCHAR (1000),
	businessOwner_id UUID NOT NULL,
	closed BOOLEAN NOT NULL DEFAULT false
)

CREATE TABLE addressess(
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	location VARCHAR(200),
	shop_id UUID
)

CREATE TABLE product(
	id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	shop_id UUID,
	product_name VARCHAR(100),
	price DECIMAL(10,2),
	desription VARCHAR(100),
	availability BOOLEAN NOT NULL DEFAULT true

)