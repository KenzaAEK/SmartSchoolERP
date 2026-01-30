package com.school.sgai.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subject {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "Advanced Java"

    private int coefficient; // e.g., 2 or 4 (Important for GPA)

    // A Subject belongs to ONE Classroom (Specific to L3-INFO-2024)
    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    // A Subject is taught by ONE Teacher
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
}
