package com.school.sgai.entities;

import com.school.sgai.enums.AbsenceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "student_id", "subject_id", "date" }) })
public class Attendance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    // Créneau horaire (ex: 1 = 8h-9h, 2 = 9h-10h...)
    // Pour simplifier, on stocke juste l'heure de début (ex: 8)
    private int sessionHour;

    @Enumerated(EnumType.STRING)
    private AbsenceStatus status;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
}
