package com.school.sgai.controllers;


import com.school.sgai.entities.Classroom;
import com.school.sgai.repositories.ClassroomRepository;
import com.school.sgai.repositories.SubjectRepository;
import com.school.sgai.services.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Controller
@RequestMapping("/admin/schedule")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ScheduleAdminController {

    private final ScheduleService scheduleService;
    private final ClassroomRepository classroomRepo;
    private final SubjectRepository subjectRepo;

    @GetMapping("")
    public String selectClass(Model model) {
        model.addAttribute("classrooms", classroomRepo.findAll());
        return "admin/schedule-select";
    }

    @GetMapping("/manage/{classId}")
    public String manageSchedule(@PathVariable Long classId, Model model) {
        Classroom classroom = classroomRepo.findById(classId).orElseThrow();

        model.addAttribute("classroom", classroom);
        model.addAttribute("sessions", scheduleService.getScheduleForClass(classId));
        model.addAttribute("subjects", subjectRepo.findByClassroomId(classId));
        model.addAttribute("days", DayOfWeek.values());

        return "admin/schedule-manage";
    }

    @PostMapping("/save")
    public String saveSession(@RequestParam Long classId,
                              @RequestParam Long subjectId,
                              @RequestParam DayOfWeek day,
                              @RequestParam LocalTime startTime,
                              @RequestParam LocalTime endTime,
                              @RequestParam String room) {

        scheduleService.addSession(subjectId, day, startTime, endTime, room);
        return "redirect:/admin/schedule/manage/" + classId;
    }

    @GetMapping("/delete/{id}")
    public String deleteSession(@PathVariable Long id, @RequestParam Long classId) {
        scheduleService.deleteSession(id);
        return "redirect:/admin/schedule/manage/" + classId;
    }
}
