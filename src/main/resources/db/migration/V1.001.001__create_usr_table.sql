CREATE TABLE usr(
 id serial PRIMARY KEY,
 login VARCHAR (50) UNIQUE NOT NULL,
 display_name VARCHAR (80) NULL,
 password VARCHAR (50) NOT NULL,
 email VARCHAR (355) UNIQUE NOT NULL,
 phone varchar(20) null,
 created_on TIMESTAMP NOT NULL
);
