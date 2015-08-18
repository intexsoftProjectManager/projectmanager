package by.intexsoft.projectmanager.dao;

import java.util.List;

import by.intexsoft.projectmanager.domain.Iteration;
import by.intexsoft.projectmanager.domain.User;

public interface IterationRepository extends EntityRepository<Iteration> {
	//List<Iteration> findByUsersAndIsCompliteOrderByFinishDate(User user, boolean isComplite);
	//List<Iteration> findByUsersOrderByFinishDate(User user);
}
