package com.school.sgai.services;


import com.school.sgai.dto.transcript.SubjectStatDTO;
import com.school.sgai.dto.transcript.TranscriptDTO;
import com.school.sgai.entities.*;
import com.school.sgai.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TranscriptService {

    private final AppUserRepository userRepo;
    private final SubjectRepository subjectRepo;
    private final EvaluationRepository evalRepo;
    private final GradeRepository gradeRepo;

    public TranscriptDTO generateTranscript(Long studentId) {
        Student student = (Student) userRepo.findById(studentId).orElseThrow();
        if (student.getClassroom() == null) {
            throw new RuntimeException("Impossible de générer le bulletin : Vous n'êtes affecté à aucune classe. Contactez l'administration.");
        }
        Classroom classroom = student.getClassroom();
        List<Subject> classSubjects = subjectRepo.findByClassroomId(classroom.getId());
        List<SubjectStatDTO> subjectStats = new ArrayList<>();

        double totalScore = 0;
        double totalCoeffs = 0;

        // 1. Calculate Average for each Subject
        for (Subject subject : classSubjects) {
            double subjectAvg = calculateSubjectAverage(student.getId(), subject.getId());

            subjectStats.add(SubjectStatDTO.builder()
                    .subjectName(subject.getName())
                    .teacherName(subject.getTeacher().getLastName())
                    .coefficient(subject.getCoefficient())
                    .average(subjectAvg)
                    .appreciation(getAppreciation(subjectAvg))
                    .build());

            totalScore += (subjectAvg * subject.getCoefficient());
            totalCoeffs += subject.getCoefficient();
        }

        // 2. Calculate Global Average
        double globalAvg = (totalCoeffs > 0) ? (totalScore / totalCoeffs) : 0.0;

        // Round to 2 decimals
        globalAvg = Math.round(globalAvg * 100.0) / 100.0;

        return TranscriptDTO.builder()
                .student(student)
                .className(classroom.getName())
                .academicYear(classroom.getAcademicYear().getCode())
                .subjects(subjectStats)
                .globalAverage(globalAvg)
                .finalDecision(globalAvg >= 10 ? "ADMITTED" : "FAILED")
                .build();
    }

    private double calculateSubjectAverage(Long studentId, Long subjectId) {
        List<Evaluation> exams = evalRepo.findBySubjectId(subjectId);

        double weightedSum = 0;
        double coeffSum = 0;

        for (Evaluation exam : exams) {
            double grade = gradeRepo.findByStudentIdAndEvaluationId(studentId, exam.getId())
                    .map(Grade::getScore)
                    .orElse(0.0);

            weightedSum += (grade * exam.getCoefficient());
            coeffSum += exam.getCoefficient();
        }

        if (coeffSum == 0) return 0.0;
        double avg = weightedSum / coeffSum;
        return Math.round(avg * 100.0) / 100.0;
    }

    private String getAppreciation(double avg) {
        if (avg < 10) return "Insufficient";
        if (avg < 12) return "Fair";
        if (avg < 14) return "Good";
        if (avg < 16) return "Very Good";
        return "Excellent";
    }
}
