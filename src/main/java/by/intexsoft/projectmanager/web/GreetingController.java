package by.intexsoft.projectmanager.web;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import by.intexsoft.projectmanager.domain.User;

@RestController
public class GreetingController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping("/greeting")
    public User greeting(@RequestParam(value="name", defaultValue="User") String name) {
    	User user = new User();
    	user.email = "user@email.ru";
    	user.lastName = "LastName";
    	user.name = name;
        return user;
    }
}