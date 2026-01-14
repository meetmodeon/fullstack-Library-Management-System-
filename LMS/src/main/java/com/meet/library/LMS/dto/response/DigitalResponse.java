package com.meet.library.LMS.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DigitalResponse {
    private Long totalBook;
    private Long totalBorrowed;
    private List<Long> listOfBookId;
}
