package by.intexsoft.projectmanager.dao;

import java.util.List;

import by.intexsoft.projectmanager.domain.Task;
import by.intexsoft.projectmanager.domain.User;

public interface TaskRepository extends EntityRepository<Task> {
	//List<Task> findByUsersAndIsCompliteOrderByFinishDate(User user, boolean isComplite);
	//List<Task> findByUsersOrderByFinishDate(User user);
}
