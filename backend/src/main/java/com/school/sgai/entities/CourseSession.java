package com.school.sgai.entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CourseSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek; // MONDAY, TUESDAY...

    private LocalTime startTime; // 08:30
    private LocalTime endTime;   // 10:30

    private String roomNumber; // "Salle B12"

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
}
