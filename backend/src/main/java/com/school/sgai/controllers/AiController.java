package com.school.sgai.controllers;

import com.school.sgai.dto.ai.RecommendationResponse;
import com.school.sgai.dto.ai.ScheduleOptimizationResponse;
import com.school.sgai.entities.Student;
import com.school.sgai.repositories.AppUserRepository;
import com.school.sgai.services.AiIntegrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Contrôleur pour les fonctionnalités IA
 * 
 * Gère les endpoints pour recommandations et optimisation EDT
 * 
 * @author Équipe SGAI
 */
@Controller
@RequestMapping("/ai")
public class AiController {
    
    private static final Logger logger = LoggerFactory.getLogger(AiController.class);
    
    @Autowired
    private AiIntegrationService aiService;
    
    @Autowired
    private AppUserRepository userRepository;
    
    // ============================================================
    // RECOMMANDATIONS DE PARCOURS
    // ============================================================
    
    /**
     * Page de recommandations pour un étudiant
     * Accessible uniquement aux étudiants eux-mêmes
     */
    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('STUDENT')")
    public String showRecommendations(Principal principal, Model model) {
        try {
            // Récupérer l'étudiant connecté
            Student student = (Student) userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
            
            logger.info("Affichage des recommandations pour étudiant {}", student.getId());
            
            // Appel au service IA
            RecommendationResponse recommendations = aiService.getRecommendations(student);
            
            model.addAttribute("student", student);
            model.addAttribute("recommendations", recommendations.getRecommendations());
            model.addAttribute("metadata", recommendations.getMetadata());
            
            return "student/ai-recommendations";
            
        } catch (Exception e) {
            logger.error("Erreur affichage recommandations", e);
            model.addAttribute("error", "Impossible de récupérer les recommandations");
            return "error-custom";
        }
    }
    
    /**
     * API REST pour obtenir les recommandations (pour usage AJAX)
     */
    @GetMapping("/api/recommendations/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    @ResponseBody
    public ResponseEntity<RecommendationResponse> getRecommendationsApi(@PathVariable Long studentId) {
        try {
            Student student = (Student) userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
            
            RecommendationResponse recommendations = aiService.getRecommendations(student);
            
            return ResponseEntity.ok(recommendations);
            
        } catch (Exception e) {
            logger.error("Erreur API recommandations", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Endpoint pour obtenir le profil d'un étudiant (utilisé par Flask)
     */
    @GetMapping("/api/students/{studentId}/profile")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getStudentProfile(@PathVariable Long studentId) {
        try {
            Student student = (Student) userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
            
            Map<String, Object> profile = aiService.buildStudentProfile(student);
            
            return ResponseEntity.ok(profile);
            
        } catch (Exception e) {
            logger.error("Erreur récupération profil étudiant", e);
            return ResponseEntity.notFound().build();
        }
    }
    
    // ============================================================
    // OPTIMISATION EMPLOI DU TEMPS
    // ============================================================
    
    /**
     * Page d'optimisation d'emploi du temps
     * Accessible uniquement aux administrateurs
     */
    @GetMapping("/schedule/optimize")
    @PreAuthorize("hasRole('ADMIN')")
    public String showScheduleOptimization(Model model) {
        // Afficher le formulaire de configuration
        model.addAttribute("constraints", getDefaultConstraints());
        return "admin/ai-schedule-optimizer";
    }
    
    /**
     * Lance l'optimisation d'un emploi du temps
     */
    @PostMapping("/schedule/optimize/{classroomId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public ResponseEntity<ScheduleOptimizationResponse> optimizeSchedule(
            @PathVariable Long classroomId,
            @RequestBody(required = false) Map<String, Boolean> constraints) {
        
        try {
            logger.info("Lancement optimisation EDT pour classe {}", classroomId);
            
            ScheduleOptimizationResponse result = aiService.optimizeSchedule(classroomId, constraints);
            
            logger.info("Optimisation terminée: {} violations dures, {} violations souples",
                result.getQuality().getHardViolations(),
                result.getQuality().getSoftViolations());
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("Erreur optimisation EDT", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Valide un emploi du temps existant
     */
    @PostMapping("/schedule/validate/{classroomId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> validateSchedule(
            @PathVariable Long classroomId,
            @RequestBody List<Map<String, Long>> schedule) {
        
        try {
            Map<String, Object> validation = aiService.validateSchedule(classroomId, schedule);
            return ResponseEntity.ok(validation);
            
        } catch (Exception e) {
            logger.error("Erreur validation EDT", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Page de résultats d'optimisation
     */
    @GetMapping("/schedule/result/{classroomId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String showOptimizationResult(@PathVariable Long classroomId, Model model) {
        // Cette page afficherait les résultats sauvegardés
        // Pour l'instant, redirection vers la page d'optimisation
        return "redirect:/ai/schedule/optimize";
    }
    
    // ============================================================
    // DASHBOARD IA (Statistiques globales)
    // ============================================================
    
    /**
     * Dashboard des services IA
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public String showAiDashboard(Model model) {
        // Statistiques d'utilisation des services IA
        // À implémenter selon besoins
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("recommendation_enabled", true);
        stats.put("schedule_enabled", true);
        stats.put("total_recommendations_today", 0);
        stats.put("total_optimizations_today", 0);
        
        model.addAttribute("aiStats", stats);
        
        return "admin/ai-dashboard";
    }
    
    // ============================================================
    // MÉTHODES UTILITAIRES
    // ============================================================
    
    /**
     * Contraintes par défaut pour l'optimisation
     */
    private Map<String, Boolean> getDefaultConstraints() {
        Map<String, Boolean> defaults = new HashMap<>();
        defaults.put("avoid_gaps", true);
        defaults.put("balance_days", true);
        defaults.put("avoid_friday_evening", true);
        return defaults;
    }
}
