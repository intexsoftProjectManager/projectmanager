package by.intexsoft.projectmanager.dao;

import java.util.List;

import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.User;

public interface ProjectRepository extends EntityRepository<Project> {
	//List<Project> findByUsersOrderByDate(User user);
}
