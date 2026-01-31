package com.school.sgai.services;


import com.school.sgai.dto.AttendanceWrapper;
import com.school.sgai.entities.*;
import com.school.sgai.enums.AbsenceStatus;
import com.school.sgai.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepo;
    private final SubjectRepository subjectRepo;
    private final AppUserRepository userRepo;

    public AttendanceWrapper getAttendanceSheet(Long subjectId, LocalDate date) {
        Subject subject = subjectRepo.findById(subjectId).orElseThrow();
        List<Student> students = subject.getClassroom().getStudents();

        AttendanceWrapper wrapper = new AttendanceWrapper();
        wrapper.setSubjectId(subjectId);
        wrapper.setDate(date);

        List<AttendanceWrapper.StudentAttendanceDTO> dtos = new ArrayList<>();

        for (Student s : students) {
            AttendanceWrapper.StudentAttendanceDTO dto = new AttendanceWrapper.StudentAttendanceDTO();
            dto.setStudentId(s.getId());
            dto.setStudentName(s.getLastName() + " " + s.getFirstName());

            AbsenceStatus status = attendanceRepo.findByStudentIdAndSubjectIdAndDate(s.getId(), subjectId, date)
                    .map(Attendance::getStatus)
                    .orElse(AbsenceStatus.PRESENT);

            dto.setStatus(status);
            dtos.add(dto);
        }

        wrapper.setStudents(dtos);
        return wrapper;
    }

    public void saveAttendance(AttendanceWrapper form) {
        Subject subject = subjectRepo.findById(form.getSubjectId()).orElseThrow();

        for (AttendanceWrapper.StudentAttendanceDTO dto : form.getStudents()) {
            Student student = (Student) userRepo.findById(dto.getStudentId()).orElseThrow();

            Attendance attendance = attendanceRepo.findByStudentIdAndSubjectIdAndDate(student.getId(), subject.getId(), form.getDate())
                    .orElse(Attendance.builder()
                            .student(student)
                            .subject(subject)
                            .date(form.getDate())
                            .build());

            attendance.setStatus(dto.getStatus());
            attendanceRepo.save(attendance);
        }
    }

    public List<Attendance> getStudentHistory(Long studentId) {
        return attendanceRepo.findByStudentIdOrderByDateDesc(studentId);
    }
}
