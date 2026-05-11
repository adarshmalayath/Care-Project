package com.carehome;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CareHomeApplication {
    public static void main(String[] args) {
        SpringApplication.run(CareHomeApplication.class, args);
        System.out.println("🏠 Care Home Backend started on http://localhost:8080");
        System.out.println("📊 H2 Console available at: http://localhost:8080/h2-console");
        System.out.println("📧 Email replies enabled — configure MAIL_PASSWORD env var");
    }
}
