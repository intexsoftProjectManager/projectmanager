package by.intexsoft.projectmanager.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import by.intexsoft.projectmanager.domain.Iteration;
import by.intexsoft.projectmanager.domain.User;

public interface IterationRepository extends EntityRepository<Iteration> {

	@Query("SELECT i FROM Iteration i INNER JOIN i.users u WHERE u = :user AND i.isComplete = :isComplete ORDER BY i.finishDate")
	List<Iteration> findByUsersAndIsCompleteOrderByFinishDate(@Param("user") User user, @Param("isComplete") boolean isComplete);
	
	@Query("SELECT i FROM Iteration i INNER JOIN i.users u WHERE u = :user ORDER BY i.finishDate")
	List<Iteration> findByUsersOrderByFinishDate(@Param("user") User user);
}
