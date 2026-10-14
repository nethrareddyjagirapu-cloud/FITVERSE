package com.fitverse.dto;

public class ChatResponse {

    private String reply;
    private boolean demo;
    private String timestamp;

    public ChatResponse() {}

    public ChatResponse(String reply, boolean demo, String timestamp) {
        this.reply = reply;
        this.demo = demo;
        this.timestamp = timestamp;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public boolean isDemo() { return demo; }
    public void setDemo(boolean demo) { this.demo = demo; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
