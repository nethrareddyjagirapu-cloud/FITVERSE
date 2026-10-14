package com.fitverse.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthResponse {

    private String token;
    private String id;
    private String email;
    private String fullName;
    private UserProfileDto profile;

    public AuthResponse() {}

    public AuthResponse(String token, String id, String email, String fullName, UserProfileDto profile) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.profile = profile;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    @JsonProperty("userId")
    public String getUserId() { return id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public UserProfileDto getProfile() { return profile; }
    public void setProfile(UserProfileDto profile) { this.profile = profile; }
}
