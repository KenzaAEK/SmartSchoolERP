package com.school.sgai.services;


import com.school.sgai.entities.*;
import com.school.sgai.enums.Role;
import com.school.sgai.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AcademicService {

    private final AppUserRepository userRepository;
    private final ClassroomRepository classroomRepo;
    private final SubjectRepository subjectRepo;
    private final PasswordEncoder passwordEncoder;

    // --- STUDENT MANAGEMENT ---

    public Student registerStudent(Student student, Long classroomId) {
        Classroom classroom = classroomRepo.findById(classroomId)
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        // Security defaults
        student.setRole(Role.STUDENT);
        student.setPassword(passwordEncoder.encode("1234")); // Default password
        student.setClassroom(classroom);

        return userRepository.save(student);
    }

    // Helper to get only Students (filtering from generic Users)
    public List<Student> getAllStudents() {
        return userRepository.findAll().stream()
                .filter(u -> u instanceof Student)
                .map(u -> (Student) u)
                .collect(Collectors.toList());
    }

    // --- SUBJECT MANAGEMENT ---

    public Subject createSubject(Subject subject, Long classroomId, Long teacherId) {
        Classroom classroom = classroomRepo.findById(classroomId).orElseThrow();

        Teacher teacher = (Teacher) userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        subject.setClassroom(classroom);
        subject.setTeacher(teacher);

        return subjectRepo.save(subject);
    }

    public List<Subject> getAllSubjects() { return subjectRepo.findAll(); }

    // Helper to get Teachers for dropdowns
    public List<Teacher> getAllTeachers() {
        return userRepository.findAll().stream()
                .filter(u -> u instanceof Teacher)
                .map(u -> (Teacher) u)
                .collect(Collectors.toList());
    }


    // --- GESTION PROFESSEURS ---

    public Teacher getTeacherById(Long id) {
        return (Teacher) userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professeur introuvable"));
    }

    public void saveTeacher(Teacher teacher) {
        if (teacher.getId() == null) {
            teacher.setRole(Role.TEACHER);
            teacher.setPassword(passwordEncoder.encode("1234")); // MDP par défaut
        } else {
            Teacher existing = getTeacherById(teacher.getId());
            teacher.setPassword(existing.getPassword());
            teacher.setRole(Role.TEACHER);
        }
        userRepository.save(teacher);
    }


    public Student getStudentById(Long id) {
        return (Student) userRepository.findById(id).orElseThrow();
    }

    public void updateStudent(Student student) {
        Student existing = getStudentById(student.getId());

        existing.setFirstName(student.getFirstName());
        existing.setLastName(student.getLastName());
        existing.setStudentIdNumber(student.getStudentIdNumber());
        existing.setClassroom(student.getClassroom());

        userRepository.save(existing);
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
