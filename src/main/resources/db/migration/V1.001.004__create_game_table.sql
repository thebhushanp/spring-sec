CREATE TABLE game(
 id serial PRIMARY KEY,
 max_players int UNIQUE NOT NULL,
 start_time TIMESTAMP NOT NULL
);
