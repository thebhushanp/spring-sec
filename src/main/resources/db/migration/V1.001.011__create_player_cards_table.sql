CREATE TABLE player_cards_map(
 player_game_id int NOT NULL,
 card_val int NOT NULL,
 foreign key (player_game_id) 
      references player_game_map(id)
);
