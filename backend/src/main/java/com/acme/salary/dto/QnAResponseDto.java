package com.acme.salary.dto;

import java.util.List;

public record QnAResponseDto(
        List<QuestionAnswerItem> questions
) {
    public record QuestionAnswerItem(
            String id,
            String question,
            String category, // "SPEND", "PARITY", "BANDS", "GEOGRAPHY", "PERFORMANCE"
            String shortAnswer,
            String detailedExplanation,
            String metricHighlight,
            String recommendation
    ) {}
}
