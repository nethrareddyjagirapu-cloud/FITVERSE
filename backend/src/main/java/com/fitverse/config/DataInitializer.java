package com.fitverse.config;

import com.fitverse.model.User;
import com.fitverse.model.UserProfile;
import com.fitverse.repository.UserProfileRepository;
import com.fitverse.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public static final String DEMO_EMAIL = "alex.fitness@fitverse.dev";
    public static final String DEMO_PASSWORD = "password123";

    public DataInitializer(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(DEMO_EMAIL)) {
            User demoUser = new User(
                    "usr-demo-01",
                    DEMO_EMAIL,
                    passwordEncoder.encode(DEMO_PASSWORD),
                    "Alex Carter"
            );
            demoUser = userRepository.save(demoUser);

            UserProfile profile = new UserProfile();
            profile.setId("prof-demo-01");
            profile.setUser(demoUser);
            profile.setAge(26);
            profile.setGender("MALE");
            profile.setHeightCm(new BigDecimal("178.0"));
            profile.setCurrentWeightKg(new BigDecimal("75.5"));
            profile.setFitnessGoal("MUSCLE_GAIN");
            profile.setActivityLevel("MODERATELY_ACTIVE");
            profile.setFitnessExperience("INTERMEDIATE");
            profile.setDietPreference("NON_VEGETARIAN");
            profile.setWorkoutLocation("GYM");
            profile.setPreferredWorkoutDays(5);
            profile.setAllergies("");
            profile.setTargetDailyCalories(2400);
            profile.setTargetDailyProtein(150);
            profile.setTargetDailyCarbs(270);
            profile.setTargetDailyFat(65);
            profile.setTargetDailyFibre(35);
            profile.setUpdatedAt(LocalDateTime.now());

            userProfileRepository.save(profile);
            log.info("Successfully initialized demo user: {} with BCrypt encoded password", DEMO_EMAIL);
        }
    }
}
