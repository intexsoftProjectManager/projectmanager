package by.intexsoft.projectmanager.dao;

import by.intexsoft.projectmanager.domain.User;

public interface UserRepository extends EntityRepository<User> {
	User findByEmailIgnoreCase(String email);
}
