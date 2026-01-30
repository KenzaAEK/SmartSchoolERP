package com.school.sgai.entities;

import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor @SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Teacher extends AppUser {

    private String employeeId;
    private String specialty; // e.g., "Computer Science"
}
