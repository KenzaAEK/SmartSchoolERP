package com.school.sgai.controllers;

import com.school.sgai.entities.AppUser;
import com.school.sgai.enums.Role;
import com.school.sgai.repositories.AppUserRepository;
import com.school.sgai.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class LoginController {

    private final DashboardService dashboardService;
    private final AppUserRepository userRepo;

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/")
    public String home(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = userRepo.findByUsername(userDetails.getUsername()).orElseThrow();

        if (user.getRole() == Role.ADMIN) {
            model.addAttribute("adminStats", dashboardService.getAdminStats());
        }
        else if (user.getRole() == Role.TEACHER) {
            model.addAttribute("teacherStats", dashboardService.getTeacherStats(user.getId()));
        }
        else if (user.getRole() == Role.STUDENT) {
            model.addAttribute("studentStats", dashboardService.getStudentStats(user.getId()));
        }

        return "index";
    }
}
