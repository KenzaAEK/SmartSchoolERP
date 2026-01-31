package com.school.sgai.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Evaluation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // e.g., "Final Exam"

    private Double maxScore; // e.g., 20.0

    private int coefficient; // e.g., 2

    private LocalDate date;

    // An Evaluation belongs to one Subject (e.g., Java)
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    // An Evaluation has many grades (one per student)
    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL)
    private List<Grade> grades;
}
