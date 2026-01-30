package com.school.sgai.services;


import com.school.sgai.dto.transcript.SubjectStatDTO;
import com.school.sgai.dto.transcript.TranscriptDTO;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.school.sgai.entities.Evaluation;
import com.school.sgai.entities.Grade;
import com.school.sgai.entities.Student;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
import java.util.List;

import java.awt.Color;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


@Service
public class ReportPdfService {

    private final Font FONT_TITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLUE);
    private final Font FONT_HEADER = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
    private final Font FONT_NORMAL = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
    private final Font FONT_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);

    // =========================================================
    // 1. BULLETIN DE NOTES (TRANSCRIPT) - Pour Étudiant
    // =========================================================
    public void exportTranscript(HttpServletResponse response, TranscriptDTO transcript) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        addSchoolHeader(document);

        Paragraph title = new Paragraph("BULLETIN DE NOTES", FONT_TITLE);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" "));

        // Info Étudiant
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.addCell(getCell("Étudiant: " + transcript.getStudent().getLastName() + " " + transcript.getStudent().getFirstName(), false));
        infoTable.addCell(getCell("Classe: " + transcript.getClassName(), false));
        infoTable.addCell(getCell("ID: " + transcript.getStudent().getStudentIdNumber(), false));
        infoTable.addCell(getCell("Année: " + transcript.getAcademicYear(), false));
        document.add(infoTable);

        document.add(new Paragraph(" "));

        // Tableau des Notes
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[] {3, 2, 1, 1, 2});

        addTableHeader(table, "Matière", "Enseignant", "Coeff", "Moyenne", "Appréciation");

        for (SubjectStatDTO stat : transcript.getSubjects()) {
            table.addCell(new Phrase(stat.getSubjectName(), FONT_NORMAL));
            table.addCell(new Phrase(stat.getTeacherName(), FONT_NORMAL));
            table.addCell(new Phrase(String.valueOf(stat.getCoefficient()), FONT_NORMAL));
            table.addCell(new Phrase(String.valueOf(stat.getAverage()), FONT_BOLD));
            table.addCell(new Phrase(stat.getAppreciation(), FONT_NORMAL));
        }

        document.add(table);

        // Résultat Final
        document.add(new Paragraph(" "));
        Paragraph result = new Paragraph("MOYENNE GÉNÉRALE : " + transcript.getGlobalAverage() + " / 20",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
        result.setAlignment(Element.ALIGN_RIGHT);
        document.add(result);

        Paragraph decision = new Paragraph("DÉCISION DU JURY : " + transcript.getFinalDecision(),
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.RED));
        decision.setAlignment(Element.ALIGN_RIGHT);
        document.add(decision);

        document.close();
    }

    // =========================================================
    // 2. LISTE DE CLASSE (CLASS LIST) - Pour Professeur
    // =========================================================
    public void exportClassList(HttpServletResponse response, List<Student> students, String className) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        addSchoolHeader(document);
        Paragraph title = new Paragraph("LISTE DE CLASSE : " + className, FONT_TITLE);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setWidths(new float[] {1, 3, 2});

        addTableHeader(table, "ID", "Nom & Prénom", "Signature / Remarques");

        for (Student s : students) {
            table.addCell(new Phrase(s.getStudentIdNumber(), FONT_NORMAL));
            table.addCell(new Phrase(s.getLastName() + " " + s.getFirstName(), FONT_BOLD));
            table.addCell(" "); // Case vide pour écrire
        }

        document.add(table);
        document.close();
    }

    // =========================================================
    // 3. CERTIFICAT DE SCOLARITÉ - Pour Étudiant
    // =========================================================
    public void exportCertificate(HttpServletResponse response, Student student) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        addSchoolHeader(document);

        Paragraph title = new Paragraph("CERTIFICAT DE SCOLARITÉ", FONT_TITLE);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(30);
        document.add(title);

        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));

        String text = "Je soussigné, Directeur de l'établissement SGAI, atteste que l'étudiant(e) :\n\n" +
                "Nom & Prénom : " + student.getLastName().toUpperCase() + " " + student.getFirstName() + "\n" +
                "Numéro Étudiant (CNE) : " + student.getStudentIdNumber() + "\n" +
                "Date de naissance : " + (student.getBirthDate() != null ? student.getBirthDate() : "N/A") + "\n\n" +
                "Est régulièrement inscrit(e) pour l'année universitaire " +
                (student.getClassroom().getAcademicYear().getCode()) + ".\n\n" +
                "Filière : " + student.getClassroom().getProgram().getName() + "\n" +
                "Classe : " + student.getClassroom().getName() + "\n\n" +
                "Ce certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.";

        Paragraph body = new Paragraph(text, FontFactory.getFont(FontFactory.HELVETICA, 12));
        body.setLeading(25f);
        document.add(body);

        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));

        Paragraph date = new Paragraph("Fait le : " + LocalDate.now().format(DateTimeFormatter.ISO_DATE), FONT_BOLD);
        date.setAlignment(Element.ALIGN_RIGHT);
        document.add(date);

        document.close();
    }

    // =========================================================
    // 4. FEUILLE DE NOTES - Pour Professeur
    // =========================================================
    public void exportGradeSheet(HttpServletResponse response, Evaluation eval, List<Grade> grades) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        addSchoolHeader(document);
        document.add(new Paragraph("FEUILLE DE NOTES", FONT_TITLE));
        document.add(new Paragraph("Examen : " + eval.getTitle() + " (Coeff " + eval.getCoefficient() + ")"));
        document.add(new Paragraph("Matière : " + eval.getSubject().getName()));
        document.add(new Paragraph("Classe : " + eval.getSubject().getClassroom().getName()));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(3);
        table.setWidths(new float[] {1, 3, 1});
        table.setWidthPercentage(100);

        addTableHeader(table, "ID Étudiant", "Nom & Prénom", "Note / " + eval.getMaxScore());

        for (Grade g : grades) {
            table.addCell(new Phrase(g.getStudent().getStudentIdNumber(), FONT_NORMAL));
            table.addCell(new Phrase(g.getStudent().getLastName() + " " + g.getStudent().getFirstName(), FONT_BOLD));

            PdfPCell scoreCell = new PdfPCell(new Phrase(String.valueOf(g.getScore()), FONT_BOLD));
            scoreCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            if(g.getScore() < 10) scoreCell.setBackgroundColor(new Color(255, 235, 238));
            table.addCell(scoreCell);
        }

        document.add(table);
        document.close();
    }

    // =========================================================
    // 5. RAPPORT GLOBAL CLASSE (PV) - Pour Admin
    // =========================================================
    public void exportClassGlobalReport(HttpServletResponse response, String className, List<TranscriptDTO> transcripts) throws IOException {
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        addSchoolHeader(document);
        document.add(new Paragraph("PROCES VERBAL DE DELIBERATION", FONT_TITLE));
        document.add(new Paragraph("Classe : " + className + " | Date : " + LocalDate.now()));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(5);
        table.setWidths(new float[] {1, 3, 1, 2, 1});
        table.setWidthPercentage(100);

        addTableHeader(table, "ID", "Étudiant", "Moyenne Générale", "Décision Jury", "Statut");

        for (TranscriptDTO t : transcripts) {
            table.addCell(new Phrase(t.getStudent().getStudentIdNumber(), FONT_NORMAL));
            table.addCell(new Phrase(t.getStudent().getLastName() + " " + t.getStudent().getFirstName(), FONT_BOLD));

            PdfPCell avgCell = new PdfPCell(new Phrase(String.valueOf(t.getGlobalAverage()), FONT_BOLD));
            avgCell.setBackgroundColor(t.getGlobalAverage() >= 10 ? Color.GREEN : Color.RED);
            table.addCell(avgCell);

            table.addCell(new Phrase(t.getFinalDecision(), FONT_NORMAL));
            table.addCell(new Phrase(t.getStudent().getAcademicStatus() != null ? t.getStudent().getAcademicStatus().name() : "PENDING", FONT_NORMAL));
        }

        document.add(table);
        document.close();
    }

    // =========================================================
    // UTILITAIRES INTERNES (Helpers)
    // =========================================================

    private void addSchoolHeader(Document doc) throws DocumentException {
        Paragraph p = new Paragraph("SGAI - Système de Gestion Académique Intégré", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.GRAY));
        p.setAlignment(Element.ALIGN_RIGHT);
        doc.add(p);
        doc.add(new Paragraph("______________________________________________________________________________"));
        doc.add(new Paragraph(" "));
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, FONT_HEADER));
            cell.setBackgroundColor(new Color(66, 66, 66));
            cell.setPadding(6);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }

    private PdfPCell getCell(String text, boolean border) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FONT_NORMAL));
        cell.setPadding(5);
        if (!border) cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }
}