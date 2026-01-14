package com.meet.library.LMS.dto.request;

public record StoredFile(
        String path,
        String fileName,
        long size
) {
}
