package by.intexsoft.projectmanager.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javassist.bytecode.analysis.Analyzer;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import by.intexsoft.projectmanager.domain.CheckList;
import by.intexsoft.projectmanager.domain.Folder;
import by.intexsoft.projectmanager.domain.Iteration;
import by.intexsoft.projectmanager.domain.Project;
import by.intexsoft.projectmanager.domain.Step;
import by.intexsoft.projectmanager.domain.Task;
import by.intexsoft.projectmanager.domain.User;
import by.intexsoft.projectmanager.domain.enums.Priority;
import by.intexsoft.projectmanager.service.ManageService;
import by.intexsoft.projectmanager.service.UserService;


@Controller
public class HomeController {
	
	@Autowired
	UserService userService;
	
	@Autowired
	ManageService manageService;

	@RequestMapping(value="/")
	public ModelAndView test(HttpServletResponse response) throws Exception{
		User addUser = userService.addUser();
		Project proj = new Project();
		proj.description="fdfsdf";
		proj.name="proj name";
		proj.users.add(addUser);
		manageService.addNewProject(addUser, proj);
		
		Folder folder = new Folder();
		folder.name = "folder";
		
		CheckList chList = new CheckList();
		chList.comment = "checkListComment";
		chList.project = proj;
		chList.users.add(addUser);
		chList.folder = folder;
		manageService.addNewCheckList(addUser, chList);		
		
		System.out.println(userService.getUserNotFinishedCheckLists(addUser).get(0).id);
		return new ModelAndView("index");
	}
}
