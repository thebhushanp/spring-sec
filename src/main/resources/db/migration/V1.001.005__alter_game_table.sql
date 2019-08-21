alter table game 
      add column admin_id integer, 
      add constraint fk_admin 
      foreign key (admin_id) 
      references usr (id);
