package by.intexsoft.projectmanager.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.User;

public interface ProjectRepository extends EntityRepository<Project> {
	@Query("SELECT p FROM Project p INNER JOIN p.users u WHERE u = :user")
	List<Project> findByUsersOrderByDate(@Param("user") User user);
}
