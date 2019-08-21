package org.game.badam7.repositories;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.game.badam7.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepo {

	@Autowired
	private EntityManager em;

	public User createUser(User user) {
		em.persist(user);
		return user;
	}

	public void updateUser(User user) {
		em.persist(user);
	}

	public void deleteUser(Integer userId) {
		em.remove(findUser(userId));
	}

	public User findUser(Integer userId) {
		return em.find(User.class, userId);
	}

	public User findUser(String loginId) {
		CriteriaBuilder builder = em.getCriteriaBuilder();;
		CriteriaQuery<User> query = builder.createQuery(User.class);
		Root<User> root = query.from(User.class);
		query.select(root).where(builder.equal(root.get("loginId"), loginId));
		Query q = em.createQuery(query);
		User user = (User) q.getSingleResult();
		return user;
	}

	public User findUser(String loginId, String password) {
		User user = findUser(loginId);
		if (user.getPassword().equals(password)) {
			return user;
		} else {
			return null;
		}
	}

	public User findByFirstName(String userName) {
		return findUser(userName);
	}
}
