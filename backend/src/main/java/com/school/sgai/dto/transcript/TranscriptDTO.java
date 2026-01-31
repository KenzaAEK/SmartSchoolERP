package com.school.sgai.dto.transcript;


import com.school.sgai.entities.Student;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class TranscriptDTO {
    private Student student;
    private String className;
    private String academicYear;
    private List<SubjectStatDTO> subjects;
    private double globalAverage;
    private String rank; // "1st", "5th"...
    private String finalDecision; // "Admitted", "Failed"
}
