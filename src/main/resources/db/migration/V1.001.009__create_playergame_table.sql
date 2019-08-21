CREATE TABLE player_game_map(
 id serial PRIMARY KEY,
 game_id int NOT NULL,
 user_id int NOT NULL,
position int not null,
 foreign key (game_id) 
      references game(id),
foreign key (user_id) 
      references usr(id)
);
