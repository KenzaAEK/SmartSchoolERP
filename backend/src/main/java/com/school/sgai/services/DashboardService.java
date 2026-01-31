package com.school.sgai.services;

import com.school.sgai.dto.DashboardStats;
import com.school.sgai.entities.*;
import com.school.sgai.enums.Role;
import com.school.sgai.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AppUserRepository userRepo;
    private final ClassroomRepository classRepo;
    private final SubjectRepository subjectRepo;
    private final GradeRepository gradeRepo;
    private final EvaluationRepository evalRepo;
    private final TranscriptService transcriptService;

    // 1. STATS ADMIN
    public DashboardStats.AdminStats getAdminStats() {
        return DashboardStats.AdminStats.builder()
                .totalStudents(userRepo.findAll().stream().filter(u -> u.getRole() == Role.STUDENT).count())
                .totalTeachers(userRepo.findAll().stream().filter(u -> u.getRole() == Role.TEACHER).count())
                .totalClasses(classRepo.count())
                .totalSubjects(subjectRepo.count())
                .build();
    }

    // 2. STATS TEACHER
    public DashboardStats.TeacherStats getTeacherStats(Long teacherId) {
        List<Subject> subjects = subjectRepo.findByTeacherId(teacherId);

        long studentCount = subjects.stream()
                .mapToLong(s -> s.getClassroom().getStudents().size())
                .sum();

        return DashboardStats.TeacherStats.builder()
                .subjectCount(subjects.size())
                .totalStudents(studentCount)
                .build();
    }

    // 3. STATS STUDENT
    public DashboardStats.StudentStats getStudentStats(Long studentId) {
        Student student = (Student) userRepo.findById(studentId).orElseThrow();

        double avg = 0.0;
        try {
            avg = transcriptService.generateTranscript(studentId).getGlobalAverage();
        } catch (Exception e) {
            avg = 0.0;
        }

        List<Grade> recentGrades = gradeRepo.findRecentGrades(studentId, PageRequest.of(0, 3));

        List<Evaluation> nextExams = List.of();
        if (student.getClassroom() != null) {
            nextExams = evalRepo.findUpcomingExams(student.getClassroom().getId(), PageRequest.of(0, 3));
        }

        return DashboardStats.StudentStats.builder()
                .globalAverage(avg)
                .recentGrades(recentGrades)
                .upcomingExams(nextExams)
                .build();
    }
}
