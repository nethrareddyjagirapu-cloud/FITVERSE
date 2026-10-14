package com.fitverse.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatRequest {

    @NotBlank(message = "Query is required")
    private String query;

    public ChatRequest() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}
