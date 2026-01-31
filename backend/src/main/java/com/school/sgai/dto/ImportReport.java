package com.school.sgai.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class ImportReport {
    private int successCount = 0;
    private int errorCount = 0;
    private List<String> errorMessages = new ArrayList<>();

    public void addSuccess() { successCount++; }
    public void addError(int row, String msg) {
        errorCount++;
        errorMessages.add("Ligne " + row + ": " + msg);
    }
}
