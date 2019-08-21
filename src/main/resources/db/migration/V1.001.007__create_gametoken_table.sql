CREATE TABLE game_token(
 id serial PRIMARY KEY,
 game_id int UNIQUE NOT NULL,
 token varchar(80) NOT NULL,
 status varchar(10) not null,
 foreign key (game_id) 
      references game(id)
);
