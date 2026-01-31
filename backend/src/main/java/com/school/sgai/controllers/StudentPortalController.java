package com.school.sgai.controllers;


import com.school.sgai.dto.transcript.TranscriptDTO;
import com.school.sgai.entities.Student;
import com.school.sgai.repositories.AppUserRepository;
import com.school.sgai.services.AttendanceService;
import com.school.sgai.services.ReportPdfService;
import com.school.sgai.services.ScheduleService;
import com.school.sgai.services.TranscriptService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/student")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentPortalController {

    private final TranscriptService transcriptService;
    private final ReportPdfService pdfService;
    private final AppUserRepository userRepo;
    private final ScheduleService scheduleService;
    private final AttendanceService attendanceService;

    @GetMapping("/transcript")
    public String viewTranscript(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        Student student = (Student) userRepo.findByUsername(userDetails.getUsername()).orElseThrow();

        TranscriptDTO dto = transcriptService.generateTranscript(student.getId());
        model.addAttribute("transcript", dto);

        return "student/transcript";
    }

    @GetMapping("/transcript/download")
    public void downloadPdf(@AuthenticationPrincipal UserDetails userDetails, HttpServletResponse response) throws IOException {
        Student student = (Student) userRepo.findByUsername(userDetails.getUsername()).orElseThrow();
        TranscriptDTO dto = transcriptService.generateTranscript(student.getId());

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=transcript.pdf");

        pdfService.exportTranscript(response, dto);
    }

    @GetMapping("/schedule")
    public String viewSchedule(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        Student student = (Student) userRepo.findByUsername(userDetails.getUsername()).orElseThrow();
        model.addAttribute("sessions", scheduleService.getScheduleForStudent(student.getId()));
        model.addAttribute("userType", "Student");
        return "common/schedule-view";
    }


    @GetMapping("/attendance")
    public String viewMyAttendance(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        Student student = (Student) userRepo.findByUsername(userDetails.getUsername()).orElseThrow();
        model.addAttribute("history", attendanceService.getStudentHistory(student.getId()));
        return "student/attendance-view";
    }

    @GetMapping("/certificate/download")
    public void downloadCertificate(@AuthenticationPrincipal UserDetails userDetails, HttpServletResponse response) throws IOException {
        Student student = (Student) userRepo.findByUsername(userDetails.getUsername()).orElseThrow();

        response.setContentType("application/pdf");
        String filename = "certificat_" + student.getStudentIdNumber() + ".pdf";
        response.setHeader("Content-Disposition", "attachment; filename=" + filename);

        pdfService.exportCertificate(response, student);
    }
}
