package com.carehome.dto;

public class LoginResponse {
    private String token;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private long expiresIn;

    public LoginResponse() {}

    public LoginResponse(String token, String username, String fullName, String email, String phone, long expiresIn) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.expiresIn = expiresIn;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(long expiresIn) { this.expiresIn = expiresIn; }
}
