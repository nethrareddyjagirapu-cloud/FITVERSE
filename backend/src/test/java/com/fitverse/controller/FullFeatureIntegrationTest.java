package com.fitverse.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitverse.dto.*;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class FullFeatureIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String jwtToken;
    private static String testEmail;
    private static String createdMealId;
    private static String createdJourneyId;

    @Test
    @Order(1)
    void testUserRegistrationAndDuplicateValidation() throws Exception {
        testEmail = "athlete" + System.currentTimeMillis() + "@fitverse.dev";

        RegisterRequest regReq = new RegisterRequest();
        regReq.setEmail(testEmail);
        regReq.setPassword("SecureP@ss123");
        regReq.setFullName("Rohan Sharma");

        UserProfileDto profile = new UserProfileDto();
        profile.setAge(24);
        profile.setGender("MALE");
        profile.setHeightCm(new BigDecimal("178"));
        profile.setCurrentWeightKg(new BigDecimal("74.5"));
        profile.setFitnessGoal("MUSCLE_GAIN");
        profile.setTargetDailyCalories(2400);
        profile.setTargetDailyProtein(150);
        regReq.setProfile(profile);

        // 1. Successful registration
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(testEmail))
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        jwtToken = jsonNode.get("token").asText();

        // 2. Duplicate registration attempt must fail with 400 Bad Request
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("already in use")));
    }

    @Test
    @Order(2)
    void testLoginSuccessAndFailure() throws Exception {
        // 1. Invalid password must fail with 400 Bad Request
        LoginRequest badLogin = new LoginRequest();
        badLogin.setEmail(testEmail);
        badLogin.setPassword("WrongPassword!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badLogin)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Invalid email or password")));

        // 2. Valid credentials must succeed
        LoginRequest validLogin = new LoginRequest();
        validLogin.setEmail(testEmail);
        validLogin.setPassword("SecureP@ss123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validLogin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.fullName").value("Rohan Sharma"));
    }

    @Test
    @Order(3)
    void testUnauthorizedAccessBlocked() throws Exception {
        // Accessing protected endpoint without Bearer token must be rejected
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(4)
    void testProfileReadAndUpdate() throws Exception {
        // 1. Read profile with JWT
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fitnessGoal").value("MUSCLE_GAIN"))
                .andExpect(jsonPath("$.targetDailyCalories").value(2400));

        // 2. Update profile
        UserProfileDto updateDto = new UserProfileDto();
        updateDto.setTargetDailyCalories(2500);
        updateDto.setCurrentWeightKg(new BigDecimal("75.0"));

        mockMvc.perform(put("/api/profile")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.targetDailyCalories").value(2500));
    }

    @Test
    @Order(5)
    void testNutritionLoggingSummaryAndDeletion() throws Exception {
        // 1. Search reference foods
        mockMvc.perform(get("/api/nutrition/foods?query=Roti"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name", containsString("Roti")));

        // 2. Log a meal item
        LogMealItemRequest mealReq = new LogMealItemRequest();
        mealReq.setFoodName("Roti (Chapati)");
        mealReq.setMealCategory("LUNCH");
        mealReq.setLogDate("2026-10-14");
        mealReq.setServingLabel("2 Rotis (70g)");
        mealReq.setQuantity(new BigDecimal("2"));
        mealReq.setTotalGrams(new BigDecimal("70"));
        mealReq.setCalories(208);
        mealReq.setProtein(new BigDecimal("6.2"));
        mealReq.setCarbs(new BigDecimal("40.0"));
        mealReq.setFat(new BigDecimal("2.4"));
        mealReq.setFibre(new BigDecimal("5.6"));

        MvcResult mealResult = mockMvc.perform(post("/api/nutrition/log")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mealReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.calories").value(208))
                .andReturn();

        createdMealId = objectMapper.readTree(mealResult.getResponse().getContentAsString()).get("id").asText();

        // 3. Get daily summary
        mockMvc.perform(get("/api/nutrition/daily?date=2026-10-14")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCalories", greaterThanOrEqualTo(208)))
                .andExpect(jsonPath("$.items", hasSize(greaterThanOrEqualTo(1))));

        // 4. Delete the meal item
        mockMvc.perform(delete("/api/nutrition/item/" + createdMealId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("deleted successfully")));
    }

    @Test
    @Order(6)
    void testWorkoutLoggingAndHistory() throws Exception {
        // 1. Get exercises
        mockMvc.perform(get("/api/workouts/exercises?muscleGroup=Chest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));

        // 2. Log workout session
        WorkoutSessionRequest sessionReq = new WorkoutSessionRequest();
        sessionReq.setName("Push Day Hypertrophy");
        sessionReq.setSessionDate("2026-10-14");
        sessionReq.setDurationMinutes(50);
        sessionReq.setTotalVolumeKg(new BigDecimal("2400.0"));
        sessionReq.setExercisesLogged(3);
        sessionReq.setNotes("Felt very strong on bench press today");

        mockMvc.perform(post("/api/workouts/session")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Push Day Hypertrophy"));

        // 3. Get workout history
        mockMvc.perform(get("/api/workouts/history")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].name").value("Push Day Hypertrophy"));
    }

    @Test
    @Order(7)
    void testJourneyStartAndStatusUpdate() throws Exception {
        JourneyRequest journeyReq = new JourneyRequest();
        journeyReq.setName("Winter Muscle Gain Phase");
        journeyReq.setGoalType("MUSCLE_GAIN");
        journeyReq.setStartingWeightKg(new BigDecimal("74.5"));
        journeyReq.setCurrentWeightKg(new BigDecimal("74.5"));
        journeyReq.setTargetWeightKg(new BigDecimal("78.0"));
        journeyReq.setStartDate("2026-10-14");
        journeyReq.setPlannedEndDate("2026-12-31");
        journeyReq.setStatus("ACTIVE");
        journeyReq.setTargetWorkoutDaysPerWeek(5);

        // 1. Start journey
        MvcResult res = mockMvc.perform(post("/api/journeys")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(journeyReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Winter Muscle Gain Phase"))
                .andReturn();

        createdJourneyId = objectMapper.readTree(res.getResponse().getContentAsString()).get("id").asText();

        // 2. Get journeys
        mockMvc.perform(get("/api/journeys")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));

        // 3. Update status
        mockMvc.perform(patch("/api/journeys/" + createdJourneyId + "/status?status=COMPLETED")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    @Order(8)
    void testProgressMeasurements() throws Exception {
        ProgressMeasurementRequest mReq = new ProgressMeasurementRequest();
        mReq.setMeasurementDate("2026-10-14");
        mReq.setWeightKg(new BigDecimal("75.0"));
        mReq.setWaistCm(new BigDecimal("82.0"));
        mReq.setChestCm(new BigDecimal("102.5"));
        mReq.setHipCm(new BigDecimal("97.0"));
        mReq.setNotes("Mid-month check-in");

        // 1. Log measurement
        mockMvc.perform(post("/api/progress/measurements")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.weightKg").value(75.0));

        // 2. Retrieve measurements
        mockMvc.perform(get("/api/progress/measurements")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @Order(9)
    void testDailyHabits() throws Exception {
        DailyHabitRequest habitReq = new DailyHabitRequest();
        habitReq.setLogDate("2026-10-14");
        habitReq.setWaterIntakeMl(2750);
        habitReq.setSleepHours(new BigDecimal("7.5"));
        habitReq.setStepsCount(9200);

        // 1. Save habit
        mockMvc.perform(post("/api/habits")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(habitReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.waterIntakeMl").value(2750))
                .andExpect(jsonPath("$.stepsCount").value(9200));

        // 2. Retrieve habit
        mockMvc.perform(get("/api/habits?date=2026-10-14")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.waterIntakeMl").value(2750))
                .andExpect(jsonPath("$.stepsCount").value(9200));
    }

    @Test
    @Order(10)
    void testFitBotChat() throws Exception {
        ChatRequest chatReq = new ChatRequest();
        chatReq.setQuery("How much protein should I eat?");

        mockMvc.perform(post("/api/fitbot/chat")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(chatReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reply").isNotEmpty())
                .andExpect(jsonPath("$.reply", containsString("protein")));
    }
}
