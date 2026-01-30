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
}
