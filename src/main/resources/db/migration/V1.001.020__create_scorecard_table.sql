CREATE TABLE score_card(
 id serial PRIMARY KEY,
 player_game_id int NOT NULL,
 score int NOT NULL,
 foreign key (player_game_id) 
      references player_game_map(id)

);
