package com.fitverse.controller;

import com.fitverse.dto.UserProfileDto;
import com.fitverse.security.UserPrincipal;
import com.fitverse.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "Profile", description = "User fitness profile, targets, and physical statistics")
public class ProfileController {

    private final AuthService authService;

    public ProfileController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "Get user fitness profile and calorie/macro goals")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileDto profile = authService.getProfile(principal.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    @Operation(summary = "Update user physical measurements and macro goals")
    public ResponseEntity<UserProfileDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserProfileDto dto) {
        UserProfileDto updated = authService.updateProfile(principal.getId(), dto);
        return ResponseEntity.ok(updated);
    }
}
