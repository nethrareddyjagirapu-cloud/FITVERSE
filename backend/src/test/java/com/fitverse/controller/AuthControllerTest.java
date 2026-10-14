package com.fitverse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitverse.dto.LoginRequest;
import com.fitverse.dto.RegisterRequest;
import com.fitverse.dto.UserProfileDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.application").value("FITVERSE API"));
    }

    @Test
    void testRegisterAndLoginFlow() throws Exception {
        String uniqueEmail = "testuser" + System.currentTimeMillis() + "@fitverse.dev";

        RegisterRequest regReq = new RegisterRequest();
        regReq.setEmail(uniqueEmail);
        regReq.setPassword("Password123!");
        regReq.setFullName("Test Athlete");

        UserProfileDto profile = new UserProfileDto();
        profile.setAge(25);
        profile.setGender("FEMALE");
        profile.setHeightCm(new java.math.BigDecimal("165"));
        profile.setCurrentWeightKg(new java.math.BigDecimal("60.0"));
        profile.setFitnessGoal("FAT_LOSS");
        profile.setTargetDailyCalories(1800);
        regReq.setProfile(profile);

        // 1. Register new user
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(uniqueEmail))
                .andExpect(jsonPath("$.profile.targetDailyCalories").value(1800));

        // 2. Login with credentials
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail(uniqueEmail);
        loginReq.setPassword("Password123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(uniqueEmail));
    }

    @Test
    void testDemoUserLoginSuccess() throws Exception {
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("alex.fitness@fitverse.dev");
        loginReq.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("alex.fitness@fitverse.dev"))
                .andExpect(jsonPath("$.userId").value("usr-demo-01"));
    }

    @Test
    void testDuplicateEmailRegistrationFailsWithClearMessage() throws Exception {
        RegisterRequest duplicateReq = new RegisterRequest();
        duplicateReq.setEmail("alex.fitness@fitverse.dev");
        duplicateReq.setPassword("password123");
        duplicateReq.setFullName("Duplicate Athlete");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email address is already in use."));
    }

    @Test
    void testEmailNormalizationWhitespaceAndCapitalization() throws Exception {
        long timestamp = System.currentTimeMillis();
        String mixedEmail = "  CaSeUser" + timestamp + "@FitVerse.DEV  ";
        String normalizedEmail = ("caseuser" + timestamp + "@fitverse.dev").toLowerCase();

        RegisterRequest regReq = new RegisterRequest();
        regReq.setEmail(mixedEmail);
        regReq.setPassword("Password123!");
        regReq.setFullName("Case Sensitive Athlete");

        // Register with spaces and mixed case
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value(normalizedEmail));

        // Login with uppercase and spaces
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("   CASEUSER" + timestamp + "@FITVERSE.dev  ");
        loginReq.setPassword("Password123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(normalizedEmail));
    }

    @Test
    void testInvalidCredentialsRejected() throws Exception {
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("alex.fitness@fitverse.dev");
        loginReq.setPassword("WrongPasswordXYZ!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    @Test
    void testUnknownEmailRejected() throws Exception {
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("unknown.ghost.user" + System.currentTimeMillis() + "@fitverse.dev");
        loginReq.setPassword("Password123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    @Test
    void testRegistrationValidationErrorsFormattedClearly() throws Exception {
        RegisterRequest invalidReq = new RegisterRequest();
        invalidReq.setEmail("notanemail");
        invalidReq.setPassword("123"); // Too short
        invalidReq.setFullName(""); // Blank

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details").isMap())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void testProtectedProfileEndpointRejectsUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testGetReferenceFoodsEndpoint() throws Exception {
        mockMvc.perform(get("/api/nutrition/foods"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(10))))
                .andExpect(jsonPath("$[0].name").isNotEmpty());
    }
}
