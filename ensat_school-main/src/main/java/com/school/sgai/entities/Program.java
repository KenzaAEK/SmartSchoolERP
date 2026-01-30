package com.school.sgai.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Program {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // e.g., "Computer Science"

    private String code; // e.g., "CS"

    @OneToMany(mappedBy = "program")
    private List<Classroom> classrooms;
}
