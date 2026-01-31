package com.school.sgai.dto;


import com.school.sgai.enums.AbsenceStatus;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceWrapper {
    private Long subjectId;
    private LocalDate date;
    private List<StudentAttendanceDTO> students;

    @Data
    public static class StudentAttendanceDTO {
        private Long studentId;
        private String studentName; // Juste pour l'affichage
        private AbsenceStatus status;
    }
}
