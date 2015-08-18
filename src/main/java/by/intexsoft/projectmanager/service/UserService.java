package by.intexsoft.projectmanager.service;

import java.util.List;

import by.intexsoft.projectmanager.domain.Iteration;
import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.Task;
import by.intexsoft.projectmanager.domain.User;

public interface UserService {
	User addUser();
	User signIn(String email, String password) throws Exception;
	User signUp(User requestUser) throws Exception;
	List<Project> getUserProjects(User user);
	List<Iteration> getUserAllIterations(User user);
	List<Iteration> getUserCompliteIterations(User user);
	List<Iteration> getUserNotCompliteIterations(User user);
	List<Task> getUserAllTasks(User user);
	List<Task> getUserCompliteTasks(User user);
	List<Task> getUserNotCompliteTasks(User user);
}
