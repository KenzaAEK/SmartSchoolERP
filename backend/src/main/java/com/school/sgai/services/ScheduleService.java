package com.school.sgai.services;


import com.school.sgai.entities.*;
import com.school.sgai.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {

    private final CourseSessionRepository sessionRepo;
    private final SubjectRepository subjectRepo;
    private final AppUserRepository userRepo;

    // --- ADMIN : CRÉATION ---
    public void addSession(Long subjectId, DayOfWeek day, LocalTime start, LocalTime end, String room) {
        // TODO: Ici, on pourrait ajouter une validation de conflit (Prof déjà occupé ?)
        Subject subject = subjectRepo.findById(subjectId).orElseThrow();

        CourseSession session = CourseSession.builder()
                .subject(subject)
                .dayOfWeek(day)
                .startTime(start)
                .endTime(end)
                .roomNumber(room)
                .build();

        sessionRepo.save(session);
    }

    public void deleteSession(Long sessionId) {
        sessionRepo.deleteById(sessionId);
    }

    // --- LECTURE ---
    public List<CourseSession> getScheduleForStudent(Long studentId) {
        Student student = (Student) userRepo.findById(studentId).orElseThrow();
        if (student.getClassroom() == null) return List.of(); // Pas de classe, pas d'emploi du temps
        return sessionRepo.findByClassroomId(student.getClassroom().getId());
    }

    public List<CourseSession> getScheduleForTeacher(Long teacherId) {
        return sessionRepo.findByTeacherId(teacherId);
    }

    // Pour l'admin : voir l'emploi du temps d'une classe spécifique
    public List<CourseSession> getScheduleForClass(Long classroomId) {
        return sessionRepo.findByClassroomId(classroomId);
    }
}
