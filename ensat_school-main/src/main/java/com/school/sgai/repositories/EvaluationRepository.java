package com.school.sgai.repositories;


import com.school.sgai.entities.Evaluation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findBySubjectId(Long subjectId);

    @Query("SELECT e FROM Evaluation e WHERE e.subject.classroom.id = :classroomId AND e.date >= CURRENT_DATE ORDER BY e.date ASC")
    List<Evaluation> findUpcomingExams(@Param("classroomId") Long classroomId, Pageable pageable);
}
