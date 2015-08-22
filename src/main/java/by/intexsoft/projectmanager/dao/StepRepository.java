package by.intexsoft.projectmanager.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import by.intexsoft.projectmanager.domain.Step;
import by.intexsoft.projectmanager.domain.User;

public interface StepRepository extends EntityRepository<Step> {

	/*@Query("SELECT s FROM Step s INNER JOIN s.users u WHERE u = :user")
	List<Step> findByUsers(@Param("user") User user);*/

}
