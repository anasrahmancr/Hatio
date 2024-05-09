package com.project.todo.Controller;

import com.project.todo.Entity.User;
import com.project.todo.Service.UserService;
import com.project.todo.dto.LoginDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    //User registration
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user, HttpServletResponse response) {
        Optional<User> existingUser = userService.findUserByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        String hashedPassword = userService.encodePassword(user.getPassword());
        user.setPassword(hashedPassword);
        userService.userRegister(user);
        Optional<User> userData = userService.findUserByEmail(user.getEmail());
        System.out.println(userData);
        Long userId = userData.get().getUserId();

        Cookie userIdCookie = new Cookie("userId", String.valueOf(userId));

        userIdCookie.setPath("/");
        userIdCookie.setMaxAge(3600);
        userIdCookie.setSecure(false);
        userIdCookie.setHttpOnly(false);

        response.addCookie(userIdCookie);
        return ResponseEntity.ok("User registered successfully ");
    }

    //User login
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginDto user, HttpServletResponse response){
        Optional<User> existingUser = userService.findUserByEmail(user.getEmail());
        if(existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        ResponseEntity<String> loginResponse = userService.verifyPassword(existingUser, user);
        if (loginResponse.getStatusCode() == HttpStatus.OK) {
            Long userId = existingUser.get().getUserId();

            Cookie userIdCookie = new Cookie("userId", String.valueOf(userId));

            userIdCookie.setPath("/");
            userIdCookie.setMaxAge(3600);
            userIdCookie.setSecure(false);
            userIdCookie.setHttpOnly(false);

            response.addCookie(userIdCookie);

            return loginResponse;
        } else {
            return loginResponse;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {

        // Delete the cookie
        Cookie cookie = new Cookie("userId", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out successfully");
    }

}