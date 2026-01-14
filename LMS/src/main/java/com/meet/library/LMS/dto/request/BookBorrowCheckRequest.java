package com.meet.library.LMS.dto.request;

import java.util.Set;

public record BookBorrowCheckRequest(Set<Long> bookIds) {
}
