CREATE TABLE role(
 id serial PRIMARY KEY,
 code VARCHAR (64) UNIQUE NOT NULL,
 display_name VARCHAR (80) NULL,
 status CHAR(1) NOT NULL
);