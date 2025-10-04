package org.example.jwt.dto;

import lombok.*;
import org.example.jwt.entity.User;

import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponse {
    
    private Integer id;
    private String fullName;
    private String email;
    private String password; // encoded password
    private Date createdAt;
    private Date updatedAt;
    private String[] authorities;
    private String username;
    private boolean accountNonExpired;
    private boolean credentialsNonExpired;
    private boolean accountNonLocked;
    private boolean enabled;

    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .password(user.getPassword())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .authorities(new String[]{}) // empty authorities array
                .username(user.getEmail())
                .accountNonExpired(true)
                .credentialsNonExpired(true)
                .accountNonLocked(true)
                .enabled(true)
                .build();
    }
}
