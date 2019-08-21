package org.game.badam7.services;

import org.game.badam7.models.User;
import org.game.badam7.repositories.UserRepo;
import org.game.badam7.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private UserRepo usersRepository;

	@Override
	public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
		User optionalUser = usersRepository.findByFirstName(userName);
		if (optionalUser == null) {
			throw new UsernameNotFoundException("Username Not Found");
		}
		return new UserDetailsImpl(optionalUser);
	}
}