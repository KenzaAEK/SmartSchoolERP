package com.school.sgai.dto;

import com.school.sgai.entities.Evaluation;
import com.school.sgai.entities.Grade;
import lombok.Builder;
import lombok.Data;
import java.util.List;

public class DashboardStats {

    @Data @Builder
    public static class AdminStats {
        private long totalStudents;
        private long totalTeachers;
        private long totalClasses;
        private long totalSubjects;
    }

    @Data @Builder
    public static class TeacherStats {
        private long subjectCount;
        private long totalStudents;
        private int upcomingExams;
    }

    @Data @Builder
    public static class StudentStats {
        private double globalAverage;
        private List<Grade> recentGrades;
        private List<Evaluation> upcomingExams;
    }
}
