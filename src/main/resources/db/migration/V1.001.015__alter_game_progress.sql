alter table game_progress drop COLUMN played_by ;

alter table game_progress 
      add column game_id integer, 
      add constraint fk_game 
      foreign key (game_id) 
      references game (id);

alter table game_progress 
      add column played_by integer, 
      add constraint fk_user 
      foreign key (played_by) 
      references usr (id);
