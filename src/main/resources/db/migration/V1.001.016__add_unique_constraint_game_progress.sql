ALTER TABLE game_progress ADD CONSTRAINT uniqueIdxPerGame UNIQUE (game_id, idx);
