ALTER TABLE game drop COLUMN ws_endpoint;
ALTER TABLE player_game_map RENAME TO game_player;
ALTER TABLE game_player ADD COLUMN ws_endpoint varchar(64);
