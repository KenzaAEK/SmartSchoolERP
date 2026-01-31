package com.school.sgai.controllers;


import com.school.sgai.dto.ImportReport;
import com.school.sgai.repositories.EvaluationRepository;
import com.school.sgai.services.ImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/import")
@RequiredArgsConstructor
public class ImportController {

    private final ImportService importService;
    private final EvaluationRepository evalRepo;


    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public String showUserImportPage() {
        return "admin/import-users";
    }

    @PostMapping("/users/students")
    @PreAuthorize("hasRole('ADMIN')")
    public String uploadStudents(@RequestParam("file") MultipartFile file, @RequestParam("separator") String separator, Model model) {
        ImportReport report = importService.importStudents(file, separator);
        model.addAttribute("report", report);
        return "admin/import-users";
    }


    @GetMapping("/grades/{evalId}")
    @PreAuthorize("hasRole('TEACHER')")
    public String showGradeImportPage(@PathVariable Long evalId, Model model) {
        model.addAttribute("evaluation", evalRepo.findById(evalId).orElseThrow());
        return "teacher/import-grades";
    }

    @PostMapping("/grades/save")
    @PreAuthorize("hasRole('TEACHER')")
    public String uploadGrades(@RequestParam("file") MultipartFile file,
                               @RequestParam Long evalId,
                               @RequestParam("separator") String separator,
                               Model model) {
        ImportReport report = importService.importGrades(file, evalId, separator);

        model.addAttribute("report", report);
        model.addAttribute("evaluation", evalRepo.findById(evalId).orElseThrow());
        return "teacher/import-grades";
    }
}
