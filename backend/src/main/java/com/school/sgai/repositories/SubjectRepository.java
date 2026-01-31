package com.school.sgai.repositories;


import com.school.sgai.entities.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByClassroomId(Long classroomId);
    List<Subject> findByTeacherId(Long teacherId);

    long countByTeacherId(Long teacherId);
}
