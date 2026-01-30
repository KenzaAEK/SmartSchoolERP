package com.school.sgai.controllers;


import com.school.sgai.entities.*;
import com.school.sgai.services.StructureService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/structure")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class StructureController {

    private final StructureService structureService;

    @GetMapping("/years")
    public String listYears(Model model) {
        model.addAttribute("years", structureService.getAllYears());
        model.addAttribute("newYear", new AcademicYear());
        return "admin/years";
    }

    @PostMapping("/years/save")
    public String saveYear(@ModelAttribute AcademicYear year) {
        structureService.saveYear(year);
        return "redirect:/admin/structure/years";
    }

    @GetMapping("/programs")
    public String listPrograms(Model model) {
        model.addAttribute("programs", structureService.getAllPrograms());
        model.addAttribute("newProgram", new Program());
        return "admin/programs";
    }

    @PostMapping("/programs/save")
    public String saveProgram(@ModelAttribute Program program) {
        structureService.saveProgram(program);
        return "redirect:/admin/structure/programs";
    }

    @GetMapping("/classes")
    public String listClasses(Model model) {
        model.addAttribute("classrooms", structureService.getAllClassrooms());
        model.addAttribute("programs", structureService.getAllPrograms());
        model.addAttribute("years", structureService.getAllYears());
        return "admin/classes";
    }

    @PostMapping("/classes/save")
    public String saveClass(@RequestParam String level,
                            @RequestParam Long programId,
                            @RequestParam Long yearId) {
        structureService.createClassroom(level, programId, yearId);
        return "redirect:/admin/structure/classes";
    }
}
