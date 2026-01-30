package com.school.sgai.services;

import com.school.sgai.dto.transcript.TranscriptDTO;
import com.school.sgai.entities.Student;
import com.school.sgai.enums.ValidationStatus;
import com.school.sgai.repositories.AppUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliberationService {

    private final AcademicService academicService;
    private final TranscriptService transcriptService;
    private final AppUserRepository userRepo;

    public List<TranscriptDTO> getJuryBoard(Long classroomId) {
        List<Student> students = userRepo.findStudentsByClassroomId(classroomId);

        return students.stream()
                .map(s -> transcriptService.generateTranscript(s.getId()))
                .collect(Collectors.toList());
    }

    public void validateStudent(Long studentId, String decision) {
        Student student = academicService.getStudentById(studentId);
        student.setAcademicStatus(ValidationStatus.VALIDATED);
        student.setJuryDecision(decision);
        userRepo.save(student);
    }

    public void validateClassroom(Long classroomId) {
        List<TranscriptDTO> board = getJuryBoard(classroomId);
        for(TranscriptDTO t : board) {
            validateStudent(t.getStudent().getId(), t.getFinalDecision());
        }
    }
}
