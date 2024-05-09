package com.project.todo.Service;

import com.project.todo.Entity.User;
import com.project.todo.Repository.UserRepository;
import com.project.todo.dto.LoginDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    //encrypt the password
    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    //Check whether password matches
    public boolean verifyUserPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }


    public void userRegister(User user) {
        userRepository.save(user);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public ResponseEntity<String> verifyPassword(Optional<User> existingUser, LoginDto user) {
        if(verifyUserPassword(user.getPassword(),existingUser.get().getPassword())){
            return ResponseEntity.ok("User login successfully ");
        }
        else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Incorrect password");
        }
    }

    public Optional<User> findUserByUserId(Long userId) {
        return userRepository.findByUserId(userId);
    }

}
