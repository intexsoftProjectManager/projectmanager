package by.intexsoft.projectmanager.service;

import java.util.List;

import by.intexsoft.projectmanager.domain.CheckList;
import by.intexsoft.projectmanager.domain.Iteration;
import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.Step;
import by.intexsoft.projectmanager.domain.Task;
import by.intexsoft.projectmanager.domain.User;

public interface UserService {
	User addUser();
	User signIn(String email, String password) throws Exception;
	User signUp(User requestUser) throws Exception;
	List<Project> getUserProjects(User user);
	List<Iteration> getAllUserIterations(User user);
	List<Iteration> getUserCompleteIterations(User user);
	List<Iteration> getUserNotCompleteIterations(User user);
	List<Task> getAllUserTasks(User user);
	List<Task> getUserCompleteTasks(User user);
	List<Task> getUserNotCompleteTasks(User user);
	List<CheckList> getUserCheckLists(User user);
	List<CheckList> getUserFinishedCheckLists(User user);
	List<CheckList> getUserNotFinishedCheckLists(User user);
	List<Step> getAllUserSteps(User user);
}
