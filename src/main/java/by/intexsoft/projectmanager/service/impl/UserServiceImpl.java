package by.intexsoft.projectmanager.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import by.intexsoft.projectmanager.dao.CheckListRepository;
import by.intexsoft.projectmanager.dao.IterationRepository;
import by.intexsoft.projectmanager.dao.PermissionsSettingsRepository;
import by.intexsoft.projectmanager.dao.ProjectRepository;
import by.intexsoft.projectmanager.dao.StepRepository;
import by.intexsoft.projectmanager.dao.TaskRepository;
import by.intexsoft.projectmanager.dao.UserRepository;
import by.intexsoft.projectmanager.domain.CheckList;
import by.intexsoft.projectmanager.domain.Iteration;
import by.intexsoft.projectmanager.domain.PermissionsSettings;
import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.Step;
import by.intexsoft.projectmanager.domain.Task;
import by.intexsoft.projectmanager.domain.User;
import by.intexsoft.projectmanager.domain.enums.UserType;
import by.intexsoft.projectmanager.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService{
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	ProjectRepository projectRepository;
	
	@Autowired
	IterationRepository iterationRepository;
	
	@Autowired
	TaskRepository taskRepository;
	
	@Autowired
	PermissionsSettingsRepository permissionsSettingsRepository;
	
	@Autowired
	CheckListRepository checkListRepository;
	
	@Autowired
	StepRepository stepRepository;
	

	@Override
	public User addUser() {
		User user = new User();
		user.email="user email 1";
		user.name="name";
		user.lastName = "user lastname";
		user.password="123456";
		user.type= UserType.DEVELOPER;
		PermissionsSettings permSettings = new PermissionsSettings();
		user.permissionsSettings = permSettings;
		user.permissionsSettings.addProject = true;
		user.permissionsSettings.addIterations = true;
		user.permissionsSettings.addTasks = true;
		user.permissionsSettings.addChecklist = true;
		user.permissionsSettings.addSteps = true;
		return userRepository.save(user);
	}

	@Override
	public User signIn(String email, String password) throws Exception {
		User user = userRepository.findByEmailIgnoreCase(email);
		if (user == null)
			throw new Exception("Incorrect login or password!");
		if (!password.equals(user.password))
			throw new Exception("Incorrect login or password!");
		return user;
	}

	@Override
	public User signUp(User requestUser) throws Exception {
		if (userRepository.findByEmailIgnoreCase(requestUser.email)!=null){
			throw new Exception("User whith this login is already exists.");
		}
		Pattern p = Pattern.compile("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
		+ "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");
		if (!p.matcher(requestUser.email).matches())
			throw new Exception("Invalid symbols in email.");
		if (requestUser.email.length() < 4)
			throw new Exception("Login must contain at least 4 symbols.");
		if (requestUser.password.length() < 6)
			throw new Exception("Password must contain at least 6 symbols.");
		if (requestUser.name.length() < 2)
			throw new Exception("Name must contain at least 2 symbols.");
		if (requestUser.lastName.length() < 2)
			throw new Exception("Surname must contain at least 2 symbols.");
		p = Pattern.compile("[\\w&&[\\D&&[^_]]]{2,18}");
		if (!p.matcher(requestUser.name).matches())
			throw new Exception("Uncorrect symbols in name.");
		if (!p.matcher(requestUser.lastName).matches())
			throw new Exception("Uncorrect symbols in surname.");
		requestUser.email = requestUser.email.toLowerCase();
		requestUser.name = Character.toUpperCase(requestUser.name.charAt(0)) + requestUser.name.substring(1);
		requestUser.lastName = Character.toUpperCase(requestUser.lastName.charAt(0)) + requestUser.lastName.substring(1);
		requestUser.permissionsSettings = new PermissionsSettings();
		return userRepository.save(requestUser);
	}

	@Override
	public List<Project> getUserProjects(User user) {
		return projectRepository.findByUsersOrderByDate(user);
	}

	@Override
	public List<Iteration> getAllUserIterations(User user) {
		return iterationRepository.findByUsersOrderByFinishDate(user);
	}

	@Override
	public List<Iteration> getUserCompleteIterations(User user) {
		return iterationRepository.findByUsersAndIsCompleteOrderByFinishDate(user, true);
	}

	@Override
	public List<Iteration> getUserNotCompleteIterations(User user) {
		return iterationRepository.findByUsersAndIsCompleteOrderByFinishDate(user, false);
	}

	@Override
	public List<Task> getAllUserTasks(User user) {
		return taskRepository.findByUsersOrderByFinishDate(user);
	}

	@Override
	public List<Task> getUserCompleteTasks(User user) {
		return taskRepository.findByUsersAndIsCompleteOrderByFinishDate(user, true);
	}

	@Override
	public List<Task> getUserNotCompleteTasks(User user) {
		return taskRepository.findByUsersAndIsCompleteOrderByFinishDate(user, false);
	}
	
	@Override
	public List<CheckList> getUserCheckLists(User user) {
		return checkListRepository.findByUsers(user);
	}

	@Override
	public List<CheckList> getUserFinishedCheckLists(User user) {
		return checkListRepository.findByUsersAndIsFinished(user, true);
	}

	@Override
	public List<CheckList> getUserNotFinishedCheckLists(User user) {
		return checkListRepository.findByUsersAndIsFinished(user, false);
	}

	@Override
	public List<Step> getAllUserSteps(User user) {
		return null;//stepRepository.findByUsers(user);
	}
	
}
