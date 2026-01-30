package com.school.sgai.repositories;

import com.school.sgai.entities.CourseSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseSessionRepository extends JpaRepository<CourseSession, Long> {
    // 1. Pour l'étudiant : Trouver par ID de sa Classe
    // On trie par Jour (Lundi -> Vendredi) puis par Heure
    @Query("SELECT cs FROM CourseSession cs WHERE cs.subject.classroom.id = :classId ORDER BY cs.dayOfWeek, cs.startTime")
    List<CourseSession> findByClassroomId(@Param("classId") Long classId);

    // 2. Pour le prof : Trouver par ID du Prof
    @Query("SELECT cs FROM CourseSession cs WHERE cs.subject.teacher.id = :teacherId ORDER BY cs.dayOfWeek, cs.startTime")
    List<CourseSession> findByTeacherId(@Param("teacherId") Long teacherId);

    // 3. Pour l'admin : Tout récupérer
    List<CourseSession> findAllByOrderByDayOfWeekAscStartTimeAsc();
}
