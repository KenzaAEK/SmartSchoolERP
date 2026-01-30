package com.school.sgai.dto;


import lombok.Data;
import java.util.List;

@Data
public class GradeInputWrapper {
    private Long evaluationId;
    private List<StudentGradeDTO> studentGrades;

    @Data
    public static class StudentGradeDTO {
        private Long studentId;
        private Double score;
    }
}
