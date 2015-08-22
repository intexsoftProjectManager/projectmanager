package by.intexsoft.projectmanager.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import by.intexsoft.projectmanager.domain.Task;
import by.intexsoft.projectmanager.domain.User;

public interface TaskRepository extends EntityRepository<Task> {
	
	@Query("SELECT t FROM Task t INNER JOIN t.users u WHERE u = :user AND t.isComplete = :isComplete ORDER BY t.finishDate")
	List<Task> findByUsersAndIsCompleteOrderByFinishDate(@Param("user") User user, @Param("isComplete") boolean isComplete);
	
	@Query("SELECT t FROM Task t INNER JOIN t.users u WHERE u = :user ORDER BY t.finishDate")
	List<Task> findByUsersOrderByFinishDate(@Param("user") User user);
}
