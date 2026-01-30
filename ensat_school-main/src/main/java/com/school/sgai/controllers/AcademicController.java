package com.school.sgai.controllers;

import com.school.sgai.entities.*;
import com.school.sgai.repositories.AttendanceRepository;
import com.school.sgai.repositories.CourseSessionRepository;
import com.school.sgai.repositories.SubjectRepository;
import com.school.sgai.services.AcademicService;
import com.school.sgai.services.StructureService;
import com.school.sgai.services.TranscriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.school.sgai.entities.Teacher;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Controller
@RequestMapping("/admin/academic")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AcademicController {

    private final AcademicService academicService;
    private final StructureService structureService;
    private final SubjectRepository subjectRepo;
    private final CourseSessionRepository courseSessionRepo;
    private final TranscriptService transcriptService;
    private final AttendanceRepository attendanceRepo;

    @GetMapping("/students")
    public String listStudents(Model model) {
        model.addAttribute("students", academicService.getAllStudents());
        model.addAttribute("classrooms", structureService.getAllClassrooms());
        model.addAttribute("newStudent", new Student());
        return "admin/students";
    }

    @PostMapping("/students/save")
    public String saveStudent(@ModelAttribute Student student, @RequestParam Long classroomId) {
        academicService.registerStudent(student, classroomId);
        return "redirect:/admin/academic/students";
    }

    @GetMapping("/subjects")
    public String listSubjects(Model model) {
        model.addAttribute("subjects", academicService.getAllSubjects());
        model.addAttribute("classrooms", structureService.getAllClassrooms());
        model.addAttribute("teachers", academicService.getAllTeachers());
        model.addAttribute("newSubject", new Subject());
        return "admin/subjects";
    }

    @PostMapping("/subjects/save")
    public String saveSubject(@ModelAttribute Subject subject,
                              @RequestParam Long classroomId,
                              @RequestParam Long teacherId) {
        academicService.createSubject(subject, classroomId, teacherId);
        return "redirect:/admin/academic/subjects";
    }

    @PostMapping("/schedule/save")
    public String saveSession(@RequestParam Long subjectId,
                              @RequestParam DayOfWeek day,
                              @RequestParam LocalTime start,
                              @RequestParam LocalTime end,
                              @RequestParam String room) {
        Subject subject = subjectRepo.findById(subjectId).orElseThrow();

        CourseSession session = CourseSession.builder()
                .subject(subject)
                .dayOfWeek(day)
                .startTime(start)
                .endTime(end)
                .roomNumber(room)
                .build();

        courseSessionRepo.save(session);
        return "redirect:/admin/academic/subjects";
    }


    // ==========================================
    // GESTION DES PROFESSEURS (TEACHERS)
    // ==========================================

    @GetMapping("/teachers")
    public String listTeachers(Model model) {
        model.addAttribute("teachers", academicService.getAllTeachers());
        return "admin/teachers";
    }

    @GetMapping("/teachers/new")
    public String newTeacherForm(Model model) {
        model.addAttribute("teacher", new Teacher());
        model.addAttribute("isEdit", false);
        return "admin/teacher-form";
    }

    @GetMapping("/teachers/edit/{id}")
    public String editTeacherForm(@PathVariable Long id, Model model) {
        Teacher t = academicService.getTeacherById(id);
        model.addAttribute("teacher", t);
        model.addAttribute("isEdit", true);
        return "admin/teacher-form";
    }

    @PostMapping("/teachers/save")
    public String saveTeacher(@ModelAttribute Teacher teacher) {
        academicService.saveTeacher(teacher);
        return "redirect:/admin/academic/teachers";
    }

    @GetMapping("/teachers/delete/{id}")
    public String deleteTeacher(@PathVariable Long id) {
        academicService.deleteUser(id);
        return "redirect:/admin/academic/teachers";
    }

    // ==========================================
    // MISE A JOUR ETUDIANTS (STUDENTS)
    // ==========================================

    @GetMapping("/students/edit/{id}")
    public String editStudentForm(@PathVariable Long id, Model model) {
        Student s = academicService.getStudentById(id);
        model.addAttribute("student", s);
        model.addAttribute("classrooms", structureService.getAllClassrooms());
        return "admin/student-form-edit";
    }

    @PostMapping("/students/update")
    public String updateStudent(@ModelAttribute Student student) {
        academicService.updateStudent(student);
        return "redirect:/admin/academic/students";
    }

    @GetMapping("/students/delete/{id}")
    public String deleteStudent(@PathVariable Long id) {
        academicService.deleteUser(id);
        return "redirect:/admin/academic/students";
    }

    // ==========================================
    // VUE DÉTAILLÉE
    // ==========================================

    @GetMapping("/students/details/{id}")
    public String studentDetails(@PathVariable Long id, Model model) {
        Student student = academicService.getStudentById(id);

        var transcript = transcriptService.generateTranscript(id);

        // Récupérer ses absences
        var absences = attendanceRepo.findByStudentId(id);

        model.addAttribute("student", student);
        model.addAttribute("transcript", transcript);
        model.addAttribute("absences", absences);

        return "admin/student-details";
    }

    @GetMapping("/teachers/details/{id}")
    public String teacherDetails(@PathVariable Long id, Model model) {
        Teacher teacher = academicService.getTeacherById(id);

        var subjects = subjectRepo.findByTeacherId(id);

        model.addAttribute("teacher", teacher);
        model.addAttribute("subjects", subjects);

        return "admin/teacher-details";
    }
}
