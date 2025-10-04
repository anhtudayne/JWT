package org.example.jwt.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "redirect:/login.html";
    }

    @GetMapping("/login")
    public String login() {
        return "redirect:/login.html";
    }

    @GetMapping("/profile")
    public String profile() {
        return "redirect:/profile.html";
    }

    @GetMapping("/register")
    public String register() {
        return "redirect:/register.html";
    }
}
