package com.school.sgai.services;


import com.school.sgai.dto.GradeInputWrapper;
import com.school.sgai.entities.*;
import com.school.sgai.enums.AbsenceStatus;
import com.school.sgai.enums.ValidationStatus;
import com.school.sgai.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class GradingService {

    private final EvaluationRepository evalRepo;
    private final GradeRepository gradeRepo;
    private final SubjectRepository subjectRepo;
    private final AppUserRepository userRepo;
    private final AttendanceRepository attendanceRepo;

    public Evaluation createEvaluation(Evaluation eval, Long subjectId) {
        Subject subject = subjectRepo.findById(subjectId).orElseThrow();
        eval.setSubject(subject);
        return evalRepo.save(eval);
    }

    public void saveGradesBulk(GradeInputWrapper form) {
        Evaluation eval = evalRepo.findById(form.getEvaluationId()).orElseThrow();

        for (GradeInputWrapper.StudentGradeDTO dto : form.getStudentGrades()) {
            if (dto.getScore() != null) {
                Student student = (Student) userRepo.findById(dto.getStudentId()).orElseThrow();
                if (student.getAcademicStatus() == ValidationStatus.VALIDATED) {
                    continue;
                }
                Optional<Grade> existing = gradeRepo.findByStudentIdAndEvaluationId(student.getId(), eval.getId());

                if (existing.isPresent()) {
                    Grade g = existing.get();
                    g.setScore(dto.getScore());
                    gradeRepo.save(g);
                } else {
                    Grade newGrade = Grade.builder()
                            .student(student)
                            .evaluation(eval)
                            .score(dto.getScore())
                            .build();
                    gradeRepo.save(newGrade);
                }
            }
        }
    }
    public void saveAttendanceBulk(Long subjectId, LocalDate date, List<Long> absentStudentIds) {
        Subject subject = subjectRepo.findById(subjectId).orElseThrow();
        List<Student> students = subject.getClassroom().getStudents();

        for (Student s : students) {
            AbsenceStatus status = absentStudentIds.contains(s.getId()) ? AbsenceStatus.ABSENT : AbsenceStatus.PRESENT;

            Attendance att = Attendance.builder()
                    .date(date)
                    .student(s)
                    .subject(subject)
                    .status(status)
                    .build();
            attendanceRepo.save(att);
        }
    }
}
