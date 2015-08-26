package by.intexsoft.projectmanager.web;

import java.util.concurrent.atomic.AtomicLong;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import by.intexsoft.projectmanager.domain.User;
import by.intexsoft.projectmanager.service.UserService;

@RestController
public class LoginController {
	
	@Autowired
	UserService userService;

    @RequestMapping("/auth/session")
    public User getUserInSession(HttpSession session) {
    	userService.addUser();
    	return (User) session.getAttribute("user");
    }
    
    @RequestMapping("/adduser")
    public User addUser() {
    	return userService.addUser();
    }
    
    @RequestMapping(value = "/login", method = RequestMethod.PUT)
    public User login(@RequestParam(value="email") String email, @RequestParam(value="password") String password, HttpSession session) throws Exception{
    	User user = userService.signIn(email, password);
    	session.setAttribute("user", user);
    	return user;
    }
}