package com.school.sgai.entities;

import com.school.sgai.enums.ValidationStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor @SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Student extends AppUser {

    private String studentIdNumber; // CNE / Massar Code
    private LocalDate birthDate;

    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    @OneToMany(mappedBy = "student")
    private List<Grade> grades;

    @Enumerated(EnumType.STRING)
    private ValidationStatus academicStatus; // PENDING, VALIDATED

    private String juryDecision; // "ADMIS", "REDOUBLEMENT"
}
