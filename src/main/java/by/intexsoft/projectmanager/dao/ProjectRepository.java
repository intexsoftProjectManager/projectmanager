package by.intexsoft.projectmanager.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.User;

public interface ProjectRepository extends EntityRepository<Project> {
/*	@Query("SELECT e FROM Project p JOIN p.users e WHERE p.users = :user")
	List<Project> findByUsersOrderByDate(User user);*/
}
