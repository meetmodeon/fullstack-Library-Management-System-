package com.meet.library.LMS.dto.request;

import com.meet.library.LMS.enums.AnnouncementType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AnnouncementRequest(
        @NotBlank(message = "Header should be required")
        String title,
        @NotBlank(message = "Message should be required")
        String message,
        @NotNull(message = "Please select type of announcement")
        AnnouncementType type
) {
}
