package com.school.sgai.dto.ai;

import java.util.List;
import java.util.Map;

/**
 * DTO pour la réponse du service d'optimisation d'emploi du temps
 * 
 * @author Équipe SGAI
 */
public class ScheduleOptimizationResponse {
    
    private Long classroomId;
    private List<ScheduleAssignment> schedule;
    private OptimizationStatistics statistics;
    private QualityMetrics quality;
    private OptimizationMetadata metadata;
    
    // Constructeurs
    public ScheduleOptimizationResponse() {}
    
    // Getters et Setters
    public Long getClassroomId() {
        return classroomId;
    }
    
    public void setClassroomId(Long classroomId) {
        this.classroomId = classroomId;
    }
    
    public List<ScheduleAssignment> getSchedule() {
        return schedule;
    }
    
    public void setSchedule(List<ScheduleAssignment> schedule) {
        this.schedule = schedule;
    }
    
    public OptimizationStatistics getStatistics() {
        return statistics;
    }
    
    public void setStatistics(OptimizationStatistics statistics) {
        this.statistics = statistics;
    }
    
    public QualityMetrics getQuality() {
        return quality;
    }
    
    public void setQuality(QualityMetrics quality) {
        this.quality = quality;
    }
    
    public OptimizationMetadata getMetadata() {
        return metadata;
    }
    
    public void setMetadata(OptimizationMetadata metadata) {
        this.metadata = metadata;
    }
    
    /**
     * Affectation d'un cours à un créneau et une salle
     */
    public static class ScheduleAssignment {
        private Long courseId;
        private Long roomId;
        private Long timeslotId;
        
        // Détails enrichis (optionnel)
        private CourseDetails course;
        private RoomDetails room;
        private TimeslotDetails timeslot;
        private TeacherDetails teacher;
        
        public ScheduleAssignment() {}
        
        // Getters et Setters
        public Long getCourseId() {
            return courseId;
        }
        
        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }
        
        public Long getRoomId() {
            return roomId;
        }
        
        public void setRoomId(Long roomId) {
            this.roomId = roomId;
        }
        
        public Long getTimeslotId() {
            return timeslotId;
        }
        
        public void setTimeslotId(Long timeslotId) {
            this.timeslotId = timeslotId;
        }
        
        public CourseDetails getCourse() {
            return course;
        }
        
        public void setCourse(CourseDetails course) {
            this.course = course;
        }
        
        public RoomDetails getRoom() {
            return room;
        }
        
        public void setRoom(RoomDetails room) {
            this.room = room;
        }
        
        public TimeslotDetails getTimeslot() {
            return timeslot;
        }
        
        public void setTimeslot(TimeslotDetails timeslot) {
            this.timeslot = timeslot;
        }
        
        public TeacherDetails getTeacher() {
            return teacher;
        }
        
        public void setTeacher(TeacherDetails teacher) {
            this.teacher = teacher;
        }
    }
    
    /**
     * Statistiques de l'optimisation
     */
    public static class OptimizationStatistics {
        private Integer generations;
        private Double bestFitness;
        private Double avgFitness;
        private Integer convergenceGeneration;
        private Double executionTimeSeconds;
        
        public OptimizationStatistics() {}
        
        // Getters et Setters
        public Integer getGenerations() {
            return generations;
        }
        
        public void setGenerations(Integer generations) {
            this.generations = generations;
        }
        
        public Double getBestFitness() {
            return bestFitness;
        }
        
        public void setBestFitness(Double bestFitness) {
            this.bestFitness = bestFitness;
        }
        
        public Double getAvgFitness() {
            return avgFitness;
        }
        
        public void setAvgFitness(Double avgFitness) {
            this.avgFitness = avgFitness;
        }
        
        public Integer getConvergenceGeneration() {
            return convergenceGeneration;
        }
        
        public void setConvergenceGeneration(Integer convergenceGeneration) {
            this.convergenceGeneration = convergenceGeneration;
        }
        
        public Double getExecutionTimeSeconds() {
            return executionTimeSeconds;
        }
        
        public void setExecutionTimeSeconds(Double executionTimeSeconds) {
            this.executionTimeSeconds = executionTimeSeconds;
        }
    }
    
    /**
     * Métriques de qualité du planning
     */
    public static class QualityMetrics {
        private Integer hardViolations;
        private Integer softViolations;
        private Integer totalViolations;
        private Boolean isValid;
        
        public QualityMetrics() {}
        
        // Getters et Setters
        public Integer getHardViolations() {
            return hardViolations;
        }
        
        public void setHardViolations(Integer hardViolations) {
            this.hardViolations = hardViolations;
        }
        
        public Integer getSoftViolations() {
            return softViolations;
        }
        
        public void setSoftViolations(Integer softViolations) {
            this.softViolations = softViolations;
        }
        
        public Integer getTotalViolations() {
            return totalViolations;
        }
        
        public void setTotalViolations(Integer totalViolations) {
            this.totalViolations = totalViolations;
        }
        
        public Boolean getIsValid() {
            return isValid;
        }
        
        public void setIsValid(Boolean isValid) {
            this.isValid = isValid;
        }
    }
    
    /**
     * Métadonnées de l'optimisation
     */
    public static class OptimizationMetadata {
        private String algorithm;
        private Integer populationSize;
        private Integer maxGenerations;
        private String optimizedAt;
        
        public OptimizationMetadata() {}
        
        // Getters et Setters omis pour brièveté
    }
    
    // Classes internes pour détails
    public static class CourseDetails {
        private Long id;
        private String subject;
        private Integer duration;
        
        public CourseDetails() {}
        // Getters/Setters omis
    }
    
    public static class RoomDetails {
        private Long id;
        private String name;
        private Integer capacity;
        
        public RoomDetails() {}
        // Getters/Setters omis
    }
    
    public static class TimeslotDetails {
        private Long id;
        private String day;
        private String startTime;
        private String endTime;
        
        public TimeslotDetails() {}
        // Getters/Setters omis
    }
    
    public static class TeacherDetails {
        private Long id;
        private String name;
        
        public TeacherDetails() {}
        // Getters/Setters omis
    }
}
