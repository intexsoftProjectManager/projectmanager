package by.intexsoft.projectmanager.service;

import by.intexsoft.projectmanager.domain.Iteration;
import by.intexsoft.projectmanager.domain.PermissionsSettings;
import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.Task;
import by.intexsoft.projectmanager.domain.User;

public interface ManageService {
	Project addNewProject(User manager, Project project) throws Exception;
	Iteration addNewIteration(User manager, Iteration iteration) throws Exception;
	Task addNewTask(User manager, Task task) throws Exception;
	void changePermissionsSettings(User manager, PermissionsSettings permSettings) throws Exception;
}
