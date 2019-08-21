package org.game.badam7.services;

import org.game.badam7.models.User;
import org.game.badam7.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	@Autowired
	private UserRepo userRepo;

	public User createUser(User user) {
		return userRepo.createUser(user);
	}

	public User findUser(String loginId) {
		return userRepo.findUser(loginId);
	}
}
