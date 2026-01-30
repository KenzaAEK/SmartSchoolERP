package com.school.sgai;

import com.school.sgai.entities.*;
import com.school.sgai.enums.Role;
import com.school.sgai.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class GlobalSeeder implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final ProgramRepository programRepo;
    private final AcademicYearRepository yearRepo;
    private final ClassroomRepository classroomRepo;
    private final SubjectRepository subjectRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // On ne lance l'init que si la base est vide (vérification sur les années)
        if (yearRepo.count() == 0) {
            System.out.println("🌱 DÉMARRAGE DU SEEDING GLOBAL...");

            // ==========================================
            // 1. STRUCTURE (ANNÉE & FILIÈRES)
            // ==========================================
            AcademicYear year = AcademicYear.builder().code("2025-2026").current(true).build();
            yearRepo.save(year);

            List<Program> programs = Arrays.asList(
                    Program.builder().code("AP").name("Années Préparatoires").build(),
                    Program.builder().code("GINF").name("Génie Informatique").build(),
                    Program.builder().code("GSR").name("Génie Systèmes et Réseaux").build(),
                    Program.builder().code("GIND").name("Génie Industriel").build(),
                    Program.builder().code("CSI").name("Cybersécurité & IA").build()
            );
            programRepo.saveAll(programs);

            // ==========================================
            // 2. CLASSES (LES SALLES DE CLASSE)
            // ==========================================
            // On crée des classes clés pour le test
            Classroom ci1Ginf = createClass(year, "GINF", "CI1"); // Cible principale
            Classroom ci2Ginf = createClass(year, "GINF", "CI2");
            Classroom ci3Ginf = createClass(year, "GINF", "CI3");
            Classroom ap1 = createClass(year, "AP", "AP1");
            Classroom ap2 = createClass(year, "AP", "AP2");
            Classroom csi1 = createClass(year, "CSI", "CI1");

            // ==========================================
            // 3. UTILISATEURS STAFF (ADMIN & PROFS)
            // ==========================================

            // ADMIN
            // Note: On utilise Teacher comme support pour l'admin car AppUser est abstrait
            // Dans un vrai projet, on aurait une entité Admin dédiée.
            Teacher admin = Teacher.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("1234"))
                    .role(Role.ADMIN)
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin@ensat.ac.ma")
                    .specialty("Administration")
                    .employeeId("ADM-001")
                    .build();
            userRepository.save(admin);

            // PROF 1 : Informatique
            Teacher profJava = Teacher.builder()
                    .username("prof1")
                    .password(passwordEncoder.encode("1234"))
                    .role(Role.TEACHER)
                    .firstName("EL HADDAD")
                    .lastName("Mohamed")
                    .email("turing@ensat.ac.ma")
                    .specialty("Informatique & Algorithmique")
                    .employeeId("PROF-IT-01")
                    .build();
            userRepository.save(profJava);

            // PROF 2 : Mathématiques
            Teacher profMath = Teacher.builder()
                    .username("prof2")
                    .password(passwordEncoder.encode("1234"))
                    .role(Role.TEACHER)
                    .firstName("Ada")
                    .lastName("Lovelace")
                    .email("lovelace@ensat.ac.ma")
                    .specialty("Mathématiques Appliquées")
                    .employeeId("PROF-MATH-01")
                    .build();
            userRepository.save(profMath);

            // ==========================================
            // 4. MATIÈRES (SUBJECTS)
            // ==========================================
            // On affecte des matières aux classes et aux profs

            createSubject("Programmation Java Avancée", 4, ci3Ginf, profJava);
            createSubject("Spring Boot Framework", 3, ci3Ginf, profJava);
            createSubject("Analyse Numérique", 2, ci1Ginf, profMath);

            createSubject("Algèbre Linéaire", 4, ap1, profMath);
            createSubject("Architecture des Ordinateurs", 3, csi1, profJava);

            // ==========================================
            // 5. ÉTUDIANTS (AVEC CLASSE !)
            // ==========================================

            // Étudiant 1 : Dans CI1-GINF (Pour tester les notes avec prof1)
            createStudent("student1", "N'faly", "SYLLA", "S130001", ci3Ginf);

            // Étudiant 2 : Dans CI1-GINF
            createStudent("bob", "Bob", "Marley", "S130002", ci1Ginf);

            // Étudiant 3 : Dans AP1 (Pour voir la différence)
            createStudent("charlie", "Charlie", "Chaplin", "S140001", ap1);

            System.out.println("✅ SEEDING TERMINÉ AVEC SUCCÈS !");
            System.out.println("👉 Admin: admin / 1234");
            System.out.println("👉 Prof Info: prof1 / 1234");
            System.out.println("👉 Etudiant GINF: student1 / 1234");
        }
    }

    // --- HELPER METHODS ---

    private Classroom createClass(AcademicYear year, String programCode, String level) {
        Program prog = programRepo.findAll().stream()
                .filter(p -> p.getCode().equals(programCode)).findFirst().orElseThrow();

        String name = level + "-" + prog.getCode() + "-" + year.getCode().substring(0,4);

        Classroom c = Classroom.builder()
                .name(name)
                .level(level)
                .program(prog)
                .academicYear(year)
                .build();
        return classroomRepo.save(c);
    }

    private void createSubject(String name, int coeff, Classroom classroom, Teacher teacher) {
        Subject s = Subject.builder()
                .name(name)
                .coefficient(coeff)
                .classroom(classroom)
                .teacher(teacher)
                .build();
        subjectRepo.save(s);
    }

    private void createStudent(String username, String first, String last, String cne, Classroom classroom) {
        Student s = Student.builder()
                .username(username)
                .password(passwordEncoder.encode("1234"))
                .role(Role.STUDENT)
                .firstName(first)
                .lastName(last)
                .email(username + "@student.ensat.ac.ma")
                .studentIdNumber(cne)
                .birthDate(LocalDate.of(2002, 1, 1))
                .classroom(classroom) // IMPORTANT : L'étudiant a une classe dès le début !
                .build();
        userRepository.save(s);
    }
}