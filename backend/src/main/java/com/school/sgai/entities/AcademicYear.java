package com.school.sgai.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AcademicYear {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; //  "2024-2025"

    private boolean current; // True if this is the active year

    @OneToMany(mappedBy = "academicYear")
    private List<Classroom> classrooms;
}
