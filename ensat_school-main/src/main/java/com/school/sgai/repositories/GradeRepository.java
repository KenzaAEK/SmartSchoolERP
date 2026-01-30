package com.school.sgai.repositories;


import com.school.sgai.entities.Grade;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findByStudentIdAndEvaluationId(Long studentId, Long evaluationId);
    List<Grade> findByStudentId(Long studentId);
    @Query("SELECT g FROM Grade g WHERE g.student.id = :studentId ORDER BY g.id DESC")
    List<Grade> findRecentGrades(@Param("studentId") Long studentId, Pageable pageable);
}
