package com.carehome.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ReplyRequest {

    @NotBlank(message = "Reply message is required")
    @Size(min = 5, max = 3000, message = "Reply must be between 5 and 3000 characters")
    private String reply;

    public ReplyRequest() {}

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
}
