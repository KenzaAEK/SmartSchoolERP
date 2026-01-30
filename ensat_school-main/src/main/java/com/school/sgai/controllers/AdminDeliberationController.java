package com.school.sgai.controllers;


import com.school.sgai.services.DeliberationService;
import com.school.sgai.services.StructureService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/deliberation")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDeliberationController {

    private final DeliberationService deliberationService;
    private final StructureService structureService;

    @GetMapping("")
    public String selectClass(Model model) {
        model.addAttribute("classrooms", structureService.getAllClassrooms());
        return "admin/deliberation-select";
    }

    @GetMapping("/board/{classId}")
    public String juryBoard(@PathVariable Long classId, Model model) {
        model.addAttribute("transcripts", deliberationService.getJuryBoard(classId));
        model.addAttribute("classId", classId);
        return "admin/deliberation-board";
    }

    @PostMapping("/validate")
    public String validateStudent(@RequestParam Long studentId,
                                  @RequestParam String decision,
                                  @RequestParam Long classId) {
        deliberationService.validateStudent(studentId, decision);
        return "redirect:/admin/deliberation/board/" + classId;
    }
}
