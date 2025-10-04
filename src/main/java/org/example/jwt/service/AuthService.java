package org.example.jwt.service;

import org.example.jwt.dto.*;
import org.example.jwt.entity.User;
import org.example.jwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service @RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public User register(RegisterRequest req) {
        if (repo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        var user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setImages(req.getImages());
        return repo.save(user);
    }

    public AuthResponse login(AuthRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                req.getEmail(), req.getPassword()));
        
        var user = repo.findByEmail(req.getEmail()).orElseThrow();
        var token = jwtService.generateToken(Map.of("name", user.getFullName()), user);
        return AuthResponse.builder().token(token).build();
    }
}
