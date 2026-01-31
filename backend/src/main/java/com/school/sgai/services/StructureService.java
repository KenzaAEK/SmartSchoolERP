package com.school.sgai.services;

import com.school.sgai.entities.*;
import com.school.sgai.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StructureService {

    private final AcademicYearRepository yearRepo;
    private final ProgramRepository programRepo;
    private final ClassroomRepository classroomRepo;

    // --- ACADEMIC YEAR LOGIC ---

    public AcademicYear saveYear(AcademicYear year) {
        if (year.isCurrent()) {

            yearRepo.unmarkAllCurrentYears();
        }
        return yearRepo.save(year);
    }

    public List<AcademicYear> getAllYears() { return yearRepo.findAll(); }
    public void deleteYear(Long id) { yearRepo.deleteById(id); }

    // --- PROGRAM LOGIC ---

    public Program saveProgram(Program program) { return programRepo.save(program); }
    public List<Program> getAllPrograms() { return programRepo.findAll(); }
    public void deleteProgram(Long id) { programRepo.deleteById(id); }

    // --- CLASSROOM LOGIC ---

    public Classroom createClassroom(String level, Long programId, Long yearId) {
        Program prog = programRepo.findById(programId).orElseThrow();
        AcademicYear year = yearRepo.findById(yearId).orElseThrow();

        // Auto-generate Name: LEVEL-CODE-YEAR (e.g., L3-CS-2024)
        String className = level + "-" + prog.getCode() + "-" + year.getCode();

        Classroom classroom = Classroom.builder()
                .name(className)
                .level(level)
                .program(prog)
                .academicYear(year)
                .build();

        return classroomRepo.save(classroom);
    }

    public List<Classroom> getAllClassrooms() { return classroomRepo.findAll(); }
}
