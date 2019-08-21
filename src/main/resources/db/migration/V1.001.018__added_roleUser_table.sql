CREATE TABLE user_role(
 user_id int UNIQUE NOT NULL,
 role_id int UNIQUE NOT NULL,
 foreign key (user_id) 
      references usr(id),
 foreign key (role_id) 
      references role(id)
);

