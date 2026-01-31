package com.school.sgai.services;


import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.school.sgai.dto.ImportReport; // A créer (voir plus bas)
import com.school.sgai.entities.*;
import com.school.sgai.enums.Role;
import com.school.sgai.repositories.*;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImportService {

    private final AppUserRepository userRepo;
    private final ClassroomRepository classroomRepo;
    private final PasswordEncoder passwordEncoder;
    private final EvaluationRepository evalRepo;
    private final GradeRepository gradeRepo;

    // ==========================================
    // 1. IMPORT ADMIN : ÉTUDIANTS
    // Format CSV : Prenom;Nom;Email;Username;CNE;CodeClasse
    // Exemple : Jean;Dupont;j.dup@school.com;jdup;D13000;CI1-GINF-2024
    // ==========================================
    public ImportReport importStudents(MultipartFile file, String separatorChoice) {

        ImportReport report = new ImportReport();
        char separator = separatorChoice.charAt(0);
        try (Reader reader = new InputStreamReader(file.getInputStream())) {
            CSVParser parser = new CSVParserBuilder()
                    .withSeparator(separator)
                    .build();
            CSVReader csvReader = new CSVReaderBuilder(reader)
                    .withCSVParser(parser)
                    .withSkipLines(1)
                    .build();

            String[] line;
            int row = 1;

            while ((line = csvReader.readNext()) != null) {
                row++;
                try {
                    if (line.length < 6) throw new Exception("Colonnes manquantes");

                    String firstName = line[0].trim();
                    String lastName = line[1].trim();
                    String email = line[2].trim();
                    String username = line[3].trim();
                    String cne = line[4].trim();
                    String classCode = line[5].trim();

                    Optional<Classroom> classOpt = classroomRepo.findAll().stream()
                            .filter(c -> c.getName().equalsIgnoreCase(classCode))
                            .findFirst();

                    if (classOpt.isEmpty()) {
                        report.addError(row, "Classe inconnue : " + classCode);
                        continue;
                    }

                    Student s = Student.builder()
                            .firstName(firstName).lastName(lastName)
                            .email(email).username(username)
                            .password(passwordEncoder.encode("1234"))
                            .role(Role.STUDENT)
                            .studentIdNumber(cne)
                            .classroom(classOpt.get())
                            .build();

                    userRepo.save(s);
                    report.addSuccess();

                } catch (Exception e) {
                    report.addError(row, e.getMessage());
                }
            }
        } catch (Exception e) {
            report.addError(0, "Erreur lecture fichier : " + e.getMessage());
        }
        return report;
    }

    // ==========================================
    // 2. IMPORT PROF : NOTES
    // Format CSV : CNE_Etudiant;Note
    // Exemple : D13000;14.5
    // ==========================================
    public ImportReport importGrades(MultipartFile file, Long evaluationId, String separatorChoice) {
        ImportReport report = new ImportReport();
        Evaluation eval = evalRepo.findById(evaluationId).orElseThrow();
        char separator = separatorChoice.charAt(0);

        try (Reader reader = new InputStreamReader(file.getInputStream())) {
            CSVParser parser = new CSVParserBuilder()
                    .withSeparator(separator)
                    .build();
            CSVReader csvReader = new CSVReaderBuilder(reader)
                    .withCSVParser(parser)
                    .withSkipLines(1)
                    .build();
            String[] line;
            int row = 1;

            while ((line = csvReader.readNext()) != null) {
                row++;
                try {
                    String cne = line[0].trim();
                    Double score = Double.parseDouble(line[1].trim());

                    Optional<AppUser> userOpt = userRepo.findAll().stream()
                            .filter(u -> u instanceof Student && ((Student) u).getStudentIdNumber().equals(cne))
                            .findFirst();

                    if (userOpt.isEmpty()) {
                        report.addError(row, "CNE introuvable : " + cne);
                        continue;
                    }

                    Student student = (Student) userOpt.get();

                    Optional<Grade> existing = gradeRepo.findByStudentIdAndEvaluationId(student.getId(), eval.getId());
                    if (existing.isPresent()) {
                        Grade g = existing.get();
                        g.setScore(score);
                        gradeRepo.save(g);
                    } else {
                        Grade g = Grade.builder().student(student).evaluation(eval).score(score).build();
                        gradeRepo.save(g);
                    }
                    report.addSuccess();

                } catch (NumberFormatException e) {
                    report.addError(row, "Format de note invalide");
                } catch (Exception e) {
                    report.addError(row, e.getMessage());
                }
            }
        } catch (Exception e) {
            report.addError(0, "Erreur fichier");
        }
        return report;
    }
}
