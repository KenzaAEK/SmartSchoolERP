package com.school.sgai.dto.transcript;


import lombok.Builder;
import lombok.Data;

@Data @Builder
public class SubjectStatDTO {
    private String subjectName;
    private String teacherName;
    private double average;
    private int coefficient;
    private String appreciation; // "Good", "Excellent"
}
