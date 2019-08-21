CREATE TABLE game_progress(
 id serial PRIMARY KEY,
 idx int NOT NULL,
 card int NOT NULL,
 played_by int NOT NULL,
 foreign key (played_by) 
      references player_game_map(id)
);
