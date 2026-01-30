package com.school.sgai.repositories;

import com.school.sgai.entities.AppUser;
import com.school.sgai.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);

    @Query("SELECT s FROM Student s WHERE s.classroom.id = :classroomId")
    List<Student> findStudentsByClassroomId(@Param("classroomId") Long classroomId);
}
