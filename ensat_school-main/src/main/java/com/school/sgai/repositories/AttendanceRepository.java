package com.school.sgai.repositories;


import com.school.sgai.entities.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    Optional<Attendance> findByStudentIdAndSubjectIdAndDate(Long studentId, Long subjectId, LocalDate date);
    List<Attendance> findBySubjectIdAndDate(Long subjectId, java.time.LocalDate date);
    List<Attendance> findByStudentIdOrderByDateDesc(Long studentId);

    // --- ADDED FOR AI SERVICES ---

    // Counts total sessions recorded for the student
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    Long countTotalSessionsByStudent(@Param("studentId") Long studentId);

    // Counts only the sessions where the student was present
    // NOTE: Ensure your Attendance entity has a 'status' field where one value is 'PRESENT'
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    Long countPresentSessionsByStudent(@Param("studentId") Long studentId);
}
