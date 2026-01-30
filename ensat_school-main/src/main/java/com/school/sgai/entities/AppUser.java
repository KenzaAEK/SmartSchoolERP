package com.school.sgai.entities;

import com.school.sgai.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Base Entity for all users.
 * Strategy JOINED: Creates a separate table for subclasses linked by ID.
 * Best for data integrity in large ERPs.
 */
@Entity
@Getter @Setter
@NoArgsConstructor @SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public abstract class AppUser {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username; // Will be used as Login ID

    @Column(nullable = false)
    private String password; // Encrypted

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;
}
