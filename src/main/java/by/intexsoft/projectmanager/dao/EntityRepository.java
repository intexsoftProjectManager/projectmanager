package by.intexsoft.projectmanager.dao;

import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Base entity repository.
 */
@NoRepositoryBean
public interface EntityRepository<T> extends JpaRepository<T, Long>
{
}
