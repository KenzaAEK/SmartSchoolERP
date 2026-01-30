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

    // --- ADDED FOR AI SERVICES ---

    // Calculate average for a specific subject (e.g., 'Mathématiques')
    // Matches: Grade -> Evaluation -> Subject -> name
    @Query("SELECT AVG(g.score) FROM Grade g WHERE g.student.id = :studentId AND g.evaluation.subject.name = :subjectName")
    Double getAverageByStudentAndSubject(@Param("studentId") Long studentId, @Param("subjectName") String subjectName);

    // Calculate overall average
    @Query("SELECT AVG(g.score) FROM Grade g WHERE g.student.id = :studentId")
    Double getOverallAverage(@Param("studentId") Long studentId);
}
