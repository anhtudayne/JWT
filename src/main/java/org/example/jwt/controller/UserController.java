package org.example.jwt.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.example.jwt.entity.User;
import org.example.jwt.repository.UserRepository;

@RestController @RequestMapping("/users") @RequiredArgsConstructor
public class UserController {
    
    private final UserRepository repo;

    @GetMapping("/me")
    public UserDetails me(@AuthenticationPrincipal UserDetails me) { 
        return me; 
    }

    @GetMapping("/{id}")
    public User byId(@PathVariable Integer id) { 
        return repo.findById(id).orElseThrow(); 
    }
}
