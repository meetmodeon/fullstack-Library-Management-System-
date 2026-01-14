package com.meet.library.LMS.config;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Book Library Management API",
                version = "1.0",
                description = "Backend API documentation for E-Commerce Application",
                contact = @Contact(
                        name = "Meet Yadav",
                        email = "meetyadav78692@gmail.com",
                        url="http://github.com/meet"
                ),
                license = @License(
                        name = "Apache 2.0",
                        url = "https://www.apache.org/licenses/LICENSE-2.0"
                )
        ),
        servers = {
                @Server(
                        url = "http://localhost:8080",
                        description = "Local Server"
                ),
                @Server(
                  url = "https://api.myproductiondomain.com",
                        description = "Production Server"
                )
        },
        externalDocs = @ExternalDocumentation(
                description = "Full Documentation",
                url =  "https://docs.myproject.com"
        )
)
@SecurityScheme(
        name = "BearerAuth",
        description = "JWT Authentication",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT"
)
public class OpenApiConfig {
}
