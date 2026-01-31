package com.school.sgai.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Classroom {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // e.g., "L3-INFO-2024"

    private String level;

    @ManyToOne
    @JoinColumn(name = "program_id")
    private Program program;

    @ManyToOne
    @JoinColumn(name = "year_id")
    private AcademicYear academicYear;

    @OneToMany(mappedBy = "classroom")
    @ToString.Exclude // Important pour éviter les boucles infinies
    private List<Student> students;
}
