package com.meet.library.LMS.dto.response;

public record RecycleHubResponse(
        Long totalBook,
        Long totalStudent,
        Double co2Save,
        Double growthRate,
        Long paperSaved,
        Long waterSaved,
        Long energySaved
) {

}
