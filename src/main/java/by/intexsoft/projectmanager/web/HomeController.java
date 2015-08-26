package by.intexsoft.projectmanager.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import javassist.bytecode.analysis.Analyzer;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
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
	
    @RequestMapping("/")
    public String greeting() {
    	User addUser = userService.addUser();
        return "index";
    }
}
