package com.school.sgai.repositories;


import com.school.sgai.entities.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    Optional<Attendance> findByStudentIdAndSubjectIdAndDate(Long studentId, Long subjectId, LocalDate date);
    List<Attendance> findBySubjectIdAndDate(Long subjectId, java.time.LocalDate date);
    List<Attendance> findByStudentIdOrderByDateDesc(Long studentId);

    // --- ADDED FOR AI SERVICES ---

    // Count total sessions recorded for this student
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    Long countTotalSessionsByStudent(@Param("studentId") Long studentId);

    // Count sessions where status is explicitly 'PRESENT'
    // NOTE: This assumes your AbsenceStatus enum has a value named PRESENT
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    Long countPresentSessionsByStudent(@Param("studentId") Long studentId);
}
