package com.school.sgai.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
// Ensure a student has only ONE grade per exam
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "student_id", "evaluation_id" }) })
public class Grade {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double score; // The actual grade (e.g., 15.5)

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "evaluation_id")
    private Evaluation evaluation;
}
