package com.school.sgai.repositories;

import com.school.sgai.entities.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    // Custom query to unset other current years
    @Modifying
    @Query("UPDATE AcademicYear y SET y.current = false")
    void unmarkAllCurrentYears();

    // Find the active year
    Optional<AcademicYear> findByCurrentTrue();
}
