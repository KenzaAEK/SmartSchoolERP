package com.school.sgai.controllers;


import com.school.sgai.dto.AttendanceWrapper;
import com.school.sgai.dto.GradeInputWrapper;
import com.school.sgai.entities.*;
import com.school.sgai.enums.AbsenceStatus;
import com.school.sgai.repositories.*;
import com.school.sgai.services.AttendanceService;
import com.school.sgai.services.GradingService;
import com.school.sgai.services.ReportPdfService;
import com.school.sgai.services.ScheduleService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/teacher")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherController {

    private final SubjectRepository subjectRepo;
    private final AppUserRepository userRepo;
    private final EvaluationRepository evalRepo;
    private final GradeRepository gradeRepo;
    private final GradingService gradingService;
    private final AttendanceRepository attendanceRepo;
    private final ReportPdfService pdfService;
    private final ScheduleService scheduleService;
    private final AttendanceService attendanceService;


    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        Teacher teacher = (Teacher) userRepo.findByUsername(userDetails.getUsername()).orElseThrow();
        List<Subject> mySubjects = subjectRepo.findByTeacherId(teacher.getId());
        model.addAttribute("subjects", mySubjects);
        return "teacher/dashboard";
    }

    @GetMapping("/subject/{id}")
    public String viewSubject(@PathVariable Long id, Model model) {
        Subject subject = subjectRepo.findById(id).orElseThrow();
        model.addAttribute("subject", subject);
        model.addAttribute("evaluations", evalRepo.findBySubjectId(id));
        model.addAttribute("newEval", new Evaluation());
        return "teacher/subject-detail";
    }

    @PostMapping("/evaluation/save")
    public String saveEval(@ModelAttribute Evaluation eval, @RequestParam Long subjectId) {
        gradingService.createEvaluation(eval, subjectId);
        return "redirect:/teacher/subject/" + subjectId;
    }

    @GetMapping("/grade/{evalId}")
    public String gradeExam(@PathVariable Long evalId, Model model) {
        Evaluation eval = evalRepo.findById(evalId).orElseThrow();
        Long classroomId = eval.getSubject().getClassroom().getId();
        List<Student> students = userRepo.findStudentsByClassroomId(classroomId);

        GradeInputWrapper wrapper = new GradeInputWrapper();
        wrapper.setEvaluationId(evalId);
        List<GradeInputWrapper.StudentGradeDTO> dtos = new ArrayList<>();

        for (Student s : students) {
            GradeInputWrapper.StudentGradeDTO dto = new GradeInputWrapper.StudentGradeDTO();
            dto.setStudentId(s.getId());

            gradeRepo.findByStudentIdAndEvaluationId(s.getId(), evalId)
                    .ifPresent(g -> dto.setScore(g.getScore()));

            dtos.add(dto);
        }
        wrapper.setStudentGrades(dtos);

        model.addAttribute("evaluation", eval);
        model.addAttribute("students", students); // For displaying names
        model.addAttribute("formWrapper", wrapper);

        return "teacher/grading-grid";
    }

    @PostMapping("/grades/save")
    public String saveGrades(@ModelAttribute GradeInputWrapper form) {
        gradingService.saveGradesBulk(form);
        Long subjectId = evalRepo.findById(form.getEvaluationId()).get().getSubject().getId();
        return "redirect:/teacher/subject/" + subjectId;
    }

    @GetMapping("/classlist/download/{subjectId}")
    public void downloadClassList(@PathVariable Long subjectId, HttpServletResponse response) throws IOException, IOException {
        Subject subject = subjectRepo.findById(subjectId).orElseThrow();
        List<Student> students = subject.getClassroom().getStudents();
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=classlist_" + subject.getClassroom().getName() + ".pdf");

        pdfService.exportClassList(response, students, subject.getClassroom().getName());
    }

    @GetMapping("/schedule")
    public String viewSchedule(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        Teacher teacher = (Teacher) userRepo.findByUsername(userDetails.getUsername()).orElseThrow();
        model.addAttribute("sessions", scheduleService.getScheduleForTeacher(teacher.getId()));
        model.addAttribute("userType", "Teacher");
        return "common/schedule-view";
    }


    @GetMapping("/grades/download/{evalId}")
    public void downloadGradeSheet(@PathVariable Long evalId, HttpServletResponse response) throws IOException {
        Evaluation eval = evalRepo.findById(evalId).orElseThrow();
        List<Grade> grades = eval.getGrades();

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=notes_" + eval.getTitle() + ".pdf");

        pdfService.exportGradeSheet(response, eval, grades);
    }


    @GetMapping("/attendance/{subjectId}")
    public String viewAttendance(@PathVariable Long subjectId,
                                 @RequestParam(required = false) LocalDate date,
                                 Model model) {
        if (date == null) date = LocalDate.now();

        Subject subject = subjectRepo.findById(subjectId).orElseThrow();
        AttendanceWrapper wrapper = attendanceService.getAttendanceSheet(subjectId, date);

        model.addAttribute("subject", subject);
        model.addAttribute("wrapper", wrapper);
        model.addAttribute("currentDate", date);

        return "teacher/attendance-sheet";
    }

    @PostMapping("/attendance/save")
    public String saveAttendance(@ModelAttribute AttendanceWrapper wrapper) {
        attendanceService.saveAttendance(wrapper);
        return "redirect:/teacher/dashboard";
    }

    public void saveAttendanceBulk(Long subjectId, LocalDate date, List<Long> absentStudentIds) {
        Subject subject = subjectRepo.findById(subjectId).orElseThrow();
        List<Student> students = subject.getClassroom().getStudents();

        for (Student s : students) {
            AbsenceStatus status = absentStudentIds.contains(s.getId()) ? AbsenceStatus.ABSENT : AbsenceStatus.PRESENT;

            Attendance att = Attendance.builder()
                    .date(date)
                    .student(s)
                    .subject(subject)
                    .status(status)
                    .build();
            attendanceRepo.save(att);
        }
    }
}
