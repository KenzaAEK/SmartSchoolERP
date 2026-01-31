package com.school.sgai.dto.ai;

import java.util.List;

/**
 * DTO pour la réponse du service de recommandation
 * 
 * @author Équipe SGAI
 */
public class RecommendationResponse {
    
    private Long studentId;
    private List<ProgramRecommendation> recommendations;
    private RecommendationMetadata metadata;
    
    // Constructeurs
    public RecommendationResponse() {}
    
    public RecommendationResponse(Long studentId, List<ProgramRecommendation> recommendations) {
        this.studentId = studentId;
        this.recommendations = recommendations;
    }
    
    // Getters et Setters
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public List<ProgramRecommendation> getRecommendations() {
        return recommendations;
    }
    
    public void setRecommendations(List<ProgramRecommendation> recommendations) {
        this.recommendations = recommendations;
    }
    
    public RecommendationMetadata getMetadata() {
        return metadata;
    }
    
    public void setMetadata(RecommendationMetadata metadata) {
        this.metadata = metadata;
    }
    
    /**
     * Classe interne pour une recommandation individuelle
     */
    public static class ProgramRecommendation {
        private String program;
        private Double score;
        private Double confidence;
        
        public ProgramRecommendation() {}
        
        public ProgramRecommendation(String program, Double score) {
            this.program = program;
            this.score = score;
        }
        
        // Getters et Setters
        public String getProgram() {
            return program;
        }
        
        public void setProgram(String program) {
            this.program = program;
        }
        
        public Double getScore() {
            return score;
        }
        
        public void setScore(Double score) {
            this.score = score;
        }
        
        public Double getConfidence() {
            return confidence;
        }
        
        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }
    }
    
    /**
     * Métadonnées de la recommandation
     */
    public static class RecommendationMetadata {
        private String algorithm;
        private Integer kNeighbors;
        private List<String> featuresUsed;
        
        public RecommendationMetadata() {}
        
        // Getters et Setters
        public String getAlgorithm() {
            return algorithm;
        }
        
        public void setAlgorithm(String algorithm) {
            this.algorithm = algorithm;
        }
        
        public Integer getkNeighbors() {
            return kNeighbors;
        }
        
        public void setkNeighbors(Integer kNeighbors) {
            this.kNeighbors = kNeighbors;
        }
        
        public List<String> getFeaturesUsed() {
            return featuresUsed;
        }
        
        public void setFeaturesUsed(List<String> featuresUsed) {
            this.featuresUsed = featuresUsed;
        }
    }
}
