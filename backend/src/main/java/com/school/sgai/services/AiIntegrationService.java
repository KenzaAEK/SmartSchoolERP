package com.school.sgai.services;

import com.school.sgai.dto.ai.RecommendationResponse;
import com.school.sgai.dto.ai.ScheduleOptimizationResponse;
import com.school.sgai.entities.Student;
import com.school.sgai.repositories.GradeRepository;
import com.school.sgai.repositories.AttendanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service d'intégration avec les APIs IA (Flask)
 * 
 * Ce service gère la communication entre Spring Boot et les micro-services IA Python
 * 
 * @author Équipe SGAI
 */
@Service
public class AiIntegrationService {
    
    private static final Logger logger = LoggerFactory.getLogger(AiIntegrationService.class);
    
    @Value("${ai.recommendation.url}")
    private String recommendationUrl;
    
    @Value("${ai.schedule.url}")
    private String scheduleUrl;
    
    @Value("${ai.recommendation.enabled:true}")
    private boolean recommendationEnabled;
    
    @Value("${ai.schedule.enabled:true}")
    private boolean scheduleEnabled;
    
    @Value("${ai.service.max-retries:3}")
    private int maxRetries;
    
    @Value("${ai.service.retry-delay:1000}")
    private int retryDelay;
    
    @Autowired
    private RestTemplate aiRestTemplate;
    
    @Autowired
    private GradeRepository gradeRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    /**
     * Obtient les recommandations de parcours pour un étudiant
     * 
     * @param student L'étudiant
     * @return Liste des recommandations ou liste vide si erreur
     */
    public RecommendationResponse getRecommendations(Student student) {
        if (!recommendationEnabled) {
            logger.warn("Service de recommandation désactivé");
            return createFallbackRecommendation(student.getId());
        }
        
        try {
            // Construction de l'URL
            String url = recommendationUrl + "/api/recommend/" + student.getId();
            
            logger.info("Appel API Recommandation pour étudiant {}: {}", student.getId(), url);
            
            // Appel avec retry
            ResponseEntity<RecommendationResponse> response = 
                callWithRetry(() -> aiRestTemplate.getForEntity(url, RecommendationResponse.class));
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Recommandations obtenues avec succès pour étudiant {}", student.getId());
                return response.getBody();
            } else {
                logger.warn("Réponse inattendue du service IA: {}", response.getStatusCode());
                return createFallbackRecommendation(student.getId());
            }
            
        } catch (Exception e) {
            logger.error("Erreur lors de l'appel au service de recommandation", e);
            return createFallbackRecommendation(student.getId());
        }
    }
    
    /**
     * Prépare le profil d'un étudiant pour l'API de recommandation
     * (Cette méthode peut être appelée par l'API Flask si nécessaire)
     * 
     * @param student L'étudiant
     * @return Profil formaté
     */
    public Map<String, Object> buildStudentProfile(Student student) {
        Map<String, Object> profile = new HashMap<>();
        
        // Informations de base
        profile.put("student_id", student.getId());
        profile.put("name", student.getFirstName() + " " + student.getLastName());
        
        // Calcul des moyennes par matière
        Double mathAvg = gradeRepository.getAverageByStudentAndSubject(student.getId(), "Mathématiques");
        Double physicsAvg = gradeRepository.getAverageByStudentAndSubject(student.getId(), "Physique");
        Double infoAvg = gradeRepository.getAverageByStudentAndSubject(student.getId(), "Informatique");
        Double overallAvg = gradeRepository.getOverallAverage(student.getId());
        
        profile.put("math_avg", mathAvg != null ? mathAvg : 0.0);
        profile.put("physics_avg", physicsAvg != null ? physicsAvg : 0.0);
        profile.put("info_avg", infoAvg != null ? infoAvg : 0.0);
        profile.put("overall_avg", overallAvg != null ? overallAvg : 0.0);
        
        // Taux d'assiduité
        Long totalSessions = attendanceRepository.countTotalSessionsByStudent(student.getId());
        Long presentSessions = attendanceRepository.countPresentSessionsByStudent(student.getId());
        
        double attendanceRate = 100.0;
        if (totalSessions != null && totalSessions > 0) {
            attendanceRate = (presentSessions != null ? presentSessions : 0) * 100.0 / totalSessions;
        }
        profile.put("attendance_rate", attendanceRate);
        
        // Rang dans la classe (simplifié)
        profile.put("class_rank", calculateClassRank(student));
        
        return profile;
    }
    
    /**
     * Optimise l'emploi du temps d'une classe
     * 
     * @param classroomId ID de la classe
     * @param constraints Contraintes d'optimisation
     * @return Résultat de l'optimisation
     */
    public ScheduleOptimizationResponse optimizeSchedule(Long classroomId, Map<String, Boolean> constraints) {
        if (!scheduleEnabled) {
            logger.warn("Service d'optimisation EDT désactivé");
            return createFallbackSchedule(classroomId);
        }
        
        try {
            String url = scheduleUrl + "/api/schedule/optimize";
            
            // Construction du corps de la requête
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("classroom_id", classroomId);
            requestBody.put("constraints", constraints != null ? constraints : getDefaultConstraints());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            logger.info("Appel API Optimisation EDT pour classe {}: {}", classroomId, url);
            
            // Appel avec retry
            ResponseEntity<ScheduleOptimizationResponse> response = 
                callWithRetry(() -> aiRestTemplate.postForEntity(url, request, ScheduleOptimizationResponse.class));
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Optimisation EDT réussie pour classe {} (fitness: {})", 
                    classroomId, 
                    response.getBody().getStatistics().getBestFitness());
                return response.getBody();
            } else {
                logger.warn("Réponse inattendue du service IA: {}", response.getStatusCode());
                return createFallbackSchedule(classroomId);
            }
            
        } catch (Exception e) {
            logger.error("Erreur lors de l'optimisation EDT", e);
            return createFallbackSchedule(classroomId);
        }
    }
    
    /**
     * Valide un emploi du temps existant
     * 
     * @param classroomId ID de la classe
     * @param schedule Planning à valider
     * @return Résultat de la validation
     */
    public Map<String, Object> validateSchedule(Long classroomId, List<Map<String, Long>> schedule) {
        try {
            String url = scheduleUrl + "/api/schedule/validate";
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("classroom_id", classroomId);
            requestBody.put("schedule", schedule);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = aiRestTemplate.postForEntity(url, request, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
            
        } catch (Exception e) {
            logger.error("Erreur lors de la validation EDT", e);
        }
        
        // Fallback
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("is_valid", false);
        fallback.put("error", "Service validation indisponible");
        return fallback;
    }
    
    // ============================================================
    // MÉTHODES UTILITAIRES
    // ============================================================
    
    /**
     * Exécute un appel API avec mécanisme de retry
     */
    private <T> T callWithRetry(SupplierWithException<T> supplier) throws Exception {
        Exception lastException = null;
        
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return supplier.get();
            } catch (RestClientException e) {
                lastException = e;
                logger.warn("Tentative {}/{} échouée, retry dans {}ms", attempt, maxRetries, retryDelay);
                
                if (attempt < maxRetries) {
                    Thread.sleep(retryDelay);
                }
            }
        }
        
        throw lastException;
    }
    
    /**
     * Crée une réponse de recommandation par défaut en cas d'erreur
     */
    private RecommendationResponse createFallbackRecommendation(Long studentId) {
        RecommendationResponse fallback = new RecommendationResponse();
        fallback.setStudentId(studentId);
        fallback.setRecommendations(new ArrayList<>());
        
        logger.warn("Utilisation de recommandations par défaut pour étudiant {}", studentId);
        return fallback;
    }
    
    /**
     * Crée une réponse d'optimisation par défaut en cas d'erreur
     */
    private ScheduleOptimizationResponse createFallbackSchedule(Long classroomId) {
        ScheduleOptimizationResponse fallback = new ScheduleOptimizationResponse();
        fallback.setClassroomId(classroomId);
        fallback.setSchedule(new ArrayList<>());
        
        logger.warn("Utilisation de planning par défaut pour classe {}", classroomId);
        return fallback;
    }
    
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
    
    /**
     * Calcule le rang approximatif d'un étudiant dans sa classe
     */
    private Integer calculateClassRank(Student student) {
        // Implémentation simplifiée
        // En production, faire une vraie requête SQL
        return 15; // Valeur par défaut
    }
    
    /**
     * Interface fonctionnelle pour retry
     */
    @FunctionalInterface
    private interface SupplierWithException<T> {
        T get() throws Exception;
    }
}
