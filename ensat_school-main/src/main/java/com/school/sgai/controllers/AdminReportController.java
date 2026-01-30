package com.school.sgai.controllers;


import com.school.sgai.dto.transcript.TranscriptDTO;
import com.school.sgai.entities.Classroom;
import com.school.sgai.repositories.ClassroomRepository;
import com.school.sgai.services.DeliberationService;
import com.school.sgai.services.ReportPdfService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminReportController {

    private final ClassroomRepository classroomRepo;
    private final DeliberationService deliberationService;
    private final ReportPdfService pdfService;

    @GetMapping
    public String reportsIndex(Model model) {
        model.addAttribute("classrooms", classroomRepo.findAll());
        return "admin/reports-index";
    }

    @GetMapping("/class/{id}")
    public void downloadClassReport(@PathVariable Long id, HttpServletResponse response) throws IOException {
        Classroom classroom = classroomRepo.findById(id).orElseThrow();

        List<TranscriptDTO> board = deliberationService.getJuryBoard(id);

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=PV_" + classroom.getName() + ".pdf");

        pdfService.exportClassGlobalReport(response, classroom.getName(), board);
    }
}
