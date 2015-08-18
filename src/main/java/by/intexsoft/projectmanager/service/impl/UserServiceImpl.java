package by.intexsoft.projectmanager.service.impl;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import by.intexsoft.projectmanager.dao.IterationRepository;
import by.intexsoft.projectmanager.dao.ProjectRepository;
import by.intexsoft.projectmanager.dao.TaskRepository;
import by.intexsoft.projectmanager.dao.UserRepository;
import by.intexsoft.projectmanager.domain.Iteration;
import by.intexsoft.projectmanager.domain.PermissionsSettings;
import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.Task;
import by.intexsoft.projectmanager.domain.User;
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
	
	

	@Override
	public User addUser() {
		User user = new User();
		user.email="erwrwer";
		user.name="name";
		user.lastName = "lastname";
		user.password="123456";
		user.type="developer";
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
		return null;//projectRepository.findByUsersOrderByDate(user);
	}

	@Override
	public List<Iteration> getUserAllIterations(User user) {
		return null;//iterationRepository.findByUsersOrderByFinishDate(user);
	}

	@Override
	public List<Iteration> getUserCompliteIterations(User user) {
		return null;//iterationRepository.findByUsersAndIsCompliteOrderByFinishDate(user, true);
	}

	@Override
	public List<Iteration> getUserNotCompliteIterations(User user) {
		return null;//iterationRepository.findByUsersAndIsCompliteOrderByFinishDate(user, false);
	}

	@Override
	public List<Task> getUserAllTasks(User user) {
		return null;//taskRepository.findByUsersAndIsCompliteOrderByFinishDate(user, true);
	}

	@Override
	public List<Task> getUserCompliteTasks(User user) {
		return null;//taskRepository.findByUsersAndIsCompliteOrderByFinishDate(user, true);
	}

	@Override
	public List<Task> getUserNotCompliteTasks(User user) {
		return null;//taskRepository.findByUsersAndIsCompliteOrderByFinishDate(user, false);
	}

	
}
