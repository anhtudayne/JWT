package org.example.jwt.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

import org.example.jwt.service.JwtService;
import org.example.jwt.service.CustomUserDetailsService;

@Component @RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final CustomUserDetailsService uds;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");
        System.out.println("Authorization header: " + header);
        
        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("No valid Authorization header found");
            chain.doFilter(req, res); 
            return;
        }
        
        String token = header.substring(7);
        System.out.println("Extracted token: " + token.substring(0, Math.min(20, token.length())) + "...");
        
        try {
            String email = jwtService.extractUsername(token);
            System.out.println("Extracted email: " + email);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var user = uds.loadUserByUsername(email);
                System.out.println("Found user: " + user.getUsername());
                
                if (jwtService.isTokenValid(token, user)) {
                    System.out.println("Token is valid, setting authentication");
                    var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    System.out.println("Token is invalid");
                }
            }
        } catch (Exception e) {
            System.out.println("JWT processing error: " + e.getMessage());
            // Set error response
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setContentType("application/json");
            res.getWriter().write("{\"type\":\"about:blank\",\"title\":\"Invalid JWT Token\",\"status\":401,\"detail\":\"" + e.getMessage() + "\",\"instance\":null,\"description\":\"" + e.getMessage() + "\"}");
            return;
        }
        
        chain.doFilter(req, res);
    }
}
