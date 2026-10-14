package com.fitverse.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "System uptime and database health diagnostics")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    @Operation(summary = "Check backend and database health status")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("application", "FITVERSE API");
        status.put("version", "1.0.0");
        status.put("timestamp", Instant.now().toString());

        boolean dbConnected = false;
        String dbProduct = "Unknown";
        try (Connection conn = dataSource.getConnection()) {
            dbConnected = !conn.isClosed();
            dbProduct = conn.getMetaData().getDatabaseProductName() + " " + conn.getMetaData().getDatabaseProductVersion();
        } catch (Exception e) {
            dbConnected = false;
            dbProduct = "Unavailable (" + e.getMessage() + ")";
        }

        Map<String, Object> dbInfo = new LinkedHashMap<>();
        dbInfo.put("connected", dbConnected);
        dbInfo.put("engine", dbProduct);
        status.put("database", dbInfo);

        return ResponseEntity.ok(status);
    }
}
