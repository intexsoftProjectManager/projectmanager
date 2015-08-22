package by.intexsoft.projectmanager.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import by.intexsoft.projectmanager.domain.CheckList;
import by.intexsoft.projectmanager.domain.User;

public interface CheckListRepository extends EntityRepository<CheckList> {

	@Query("SELECT c FROM CheckList c INNER JOIN c.users u WHERE u = :user")
	List<CheckList> findByUsers(@Param("user") User user);

	@Query("SELECT c FROM CheckList c INNER JOIN c.users u WHERE u = :user AND c.isFinished = :isFinished")
	List<CheckList> findByUsersAndIsFinished(@Param("user") User user, @Param("isFinished") boolean isFinished);
	
}
