package by.intexsoft.projectmanager.web;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import by.intexsoft.projectmanager.domain.User;
import by.intexsoft.projectmanager.service.UserService;


@Controller
public class HomeController {
	
	@Autowired
	UserService userService;

	@RequestMapping(value="/")
	public ModelAndView test(HttpServletResponse response) throws IOException{
		User addUser = userService.addUser();
		return new ModelAndView("index");
	}
}
