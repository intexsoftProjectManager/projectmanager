package by.intexsoft.projectmanager.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import by.intexsoft.projectmanager.dao.CheckListRepository;
import by.intexsoft.projectmanager.dao.IterationRepository;
import by.intexsoft.projectmanager.dao.PermissionsSettingsRepository;
import by.intexsoft.projectmanager.dao.ProjectRepository;
import by.intexsoft.projectmanager.dao.StepRepository;
import by.intexsoft.projectmanager.dao.TaskRepository;
import by.intexsoft.projectmanager.domain.CheckList;
import by.intexsoft.projectmanager.domain.Iteration;
import by.intexsoft.projectmanager.domain.PermissionsSettings;
import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.Step;
import by.intexsoft.projectmanager.domain.Task;
import by.intexsoft.projectmanager.domain.User;
import by.intexsoft.projectmanager.service.ManageService;

@Service
@Transactional
public class ManageServiceImpl implements ManageService {
	
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
	public Project addNewProject(User manager, Project project) throws Exception {
		if (!manager.permissionsSettings.addProject)
			throw new Exception("This user cant create new projects!");
		return projectRepository.save(project);
	}

	@Override
	public Iteration addNewIteration(User manager, Iteration iteration) throws Exception {
		if (!manager.permissionsSettings.addIterations)
			throw new Exception("This user cant create new Iterations!");
		return iterationRepository.save(iteration);
	}

	@Override
	public Task addNewTask(User manager, Task task) throws Exception {
		if (!manager.permissionsSettings.addTasks)
			throw new Exception("This user cant create new Tasks!");
		return taskRepository.save(task);
	}

	@Override
	public void changePermissionsSettings(User manager,	PermissionsSettings permSettings) throws Exception {
		if (!manager.permissionsSettings.editPermissionsSettings)
			throw new Exception("This user cant change Permissions Settings!");
		permissionsSettingsRepository.save(permSettings);
	}

	@Override
	public CheckList addNewCheckList(User manager, CheckList checkList)	throws Exception {
		if (!manager.permissionsSettings.addChecklist)
			throw new Exception("This user cant create new CheckL ists!");
		return checkListRepository.save(checkList);
	}

	@Override
	public Step addNewStep(User manager, Step step) throws Exception {
		if (!manager.permissionsSettings.addSteps)
			throw new Exception("This user cant create new steps!");
		return stepRepository.save(step);
	}

}
