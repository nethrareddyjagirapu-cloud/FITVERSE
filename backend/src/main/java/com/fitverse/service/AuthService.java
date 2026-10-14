package com.fitverse.service;

import com.fitverse.dto.AuthResponse;
import com.fitverse.dto.LoginRequest;
import com.fitverse.dto.RegisterRequest;
import com.fitverse.dto.UserProfileDto;
import com.fitverse.model.User;
import com.fitverse.model.UserProfile;
import com.fitverse.repository.UserProfileRepository;
import com.fitverse.repository.UserRepository;
import com.fitverse.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email address is already in use.");
        }

        String userId = "usr-" + UUID.randomUUID().toString();
        User user = new User(
                userId,
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim()
        );

        user = userRepository.save(user);

        UserProfile profile = new UserProfile();
        profile.setId("prof-" + UUID.randomUUID().toString());
        profile.setUser(user);

        if (request.getProfile() != null) {
            UserProfileDto dto = request.getProfile();
            profile.setAge(dto.getAge());
            profile.setGender(dto.getGender());
            profile.setHeightCm(dto.getHeightCm());
            profile.setCurrentWeightKg(dto.getCurrentWeightKg());
            profile.setFitnessGoal(dto.getFitnessGoal());
            profile.setActivityLevel(dto.getActivityLevel());
            profile.setFitnessExperience(dto.getFitnessExperience());
            profile.setDietPreference(dto.getDietPreference());
            profile.setWorkoutLocation(dto.getWorkoutLocation());
            profile.setPreferredWorkoutDays(dto.getPreferredWorkoutDays() != null ? dto.getPreferredWorkoutDays() : 4);
            profile.setAllergies(dto.getAllergies());
            profile.setTargetDailyCalories(dto.getTargetDailyCalories() != null ? dto.getTargetDailyCalories() : 2200);
            profile.setTargetDailyProtein(dto.getTargetDailyProtein() != null ? dto.getTargetDailyProtein() : 140);
            profile.setTargetDailyCarbs(dto.getTargetDailyCarbs() != null ? dto.getTargetDailyCarbs() : 250);
            profile.setTargetDailyFat(dto.getTargetDailyFat() != null ? dto.getTargetDailyFat() : 65);
            profile.setTargetDailyFibre(dto.getTargetDailyFibre() != null ? dto.getTargetDailyFibre() : 35);
        }

        userProfileRepository.save(profile);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), toDto(profile));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElse(null);
        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), profile != null ? toDto(profile) : null);
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(String userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found."));
        return toDto(profile);
    }

    @Transactional
    public UserProfileDto updateProfile(String userId, UserProfileDto dto) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found."));

        if (dto.getAge() != null) profile.setAge(dto.getAge());
        if (dto.getGender() != null) profile.setGender(dto.getGender());
        if (dto.getHeightCm() != null) profile.setHeightCm(dto.getHeightCm());
        if (dto.getCurrentWeightKg() != null) profile.setCurrentWeightKg(dto.getCurrentWeightKg());
        if (dto.getFitnessGoal() != null) profile.setFitnessGoal(dto.getFitnessGoal());
        if (dto.getActivityLevel() != null) profile.setActivityLevel(dto.getActivityLevel());
        if (dto.getFitnessExperience() != null) profile.setFitnessExperience(dto.getFitnessExperience());
        if (dto.getDietPreference() != null) profile.setDietPreference(dto.getDietPreference());
        if (dto.getWorkoutLocation() != null) profile.setWorkoutLocation(dto.getWorkoutLocation());
        if (dto.getPreferredWorkoutDays() != null) profile.setPreferredWorkoutDays(dto.getPreferredWorkoutDays());
        if (dto.getAllergies() != null) profile.setAllergies(dto.getAllergies());
        if (dto.getTargetDailyCalories() != null) profile.setTargetDailyCalories(dto.getTargetDailyCalories());
        if (dto.getTargetDailyProtein() != null) profile.setTargetDailyProtein(dto.getTargetDailyProtein());
        if (dto.getTargetDailyCarbs() != null) profile.setTargetDailyCarbs(dto.getTargetDailyCarbs());
        if (dto.getTargetDailyFat() != null) profile.setTargetDailyFat(dto.getTargetDailyFat());
        if (dto.getTargetDailyFibre() != null) profile.setTargetDailyFibre(dto.getTargetDailyFibre());
        profile.setUpdatedAt(LocalDateTime.now());

        profile = userProfileRepository.save(profile);
        return toDto(profile);
    }

    public UserProfileDto toDto(UserProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setAge(profile.getAge());
        dto.setGender(profile.getGender());
        dto.setHeightCm(profile.getHeightCm());
        dto.setCurrentWeightKg(profile.getCurrentWeightKg());
        dto.setFitnessGoal(profile.getFitnessGoal());
        dto.setActivityLevel(profile.getActivityLevel());
        dto.setFitnessExperience(profile.getFitnessExperience());
        dto.setDietPreference(profile.getDietPreference());
        dto.setWorkoutLocation(profile.getWorkoutLocation());
        dto.setPreferredWorkoutDays(profile.getPreferredWorkoutDays());
        dto.setAllergies(profile.getAllergies());
        dto.setTargetDailyCalories(profile.getTargetDailyCalories());
        dto.setTargetDailyProtein(profile.getTargetDailyProtein());
        dto.setTargetDailyCarbs(profile.getTargetDailyCarbs());
        dto.setTargetDailyFat(profile.getTargetDailyFat());
        dto.setTargetDailyFibre(profile.getTargetDailyFibre());
        return dto;
    }
}
