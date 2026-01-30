package com.school.sgai.controllers;


import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public String handleRuntimeException(RuntimeException ex, Model model) {
        model.addAttribute("errorTitle", "Opération Impossible");
        model.addAttribute("errorMessage", ex.getMessage());
        return "error-custom";
    }

    @ExceptionHandler(Exception.class)
    public String handleGlobalException(Exception ex, Model model) {
        model.addAttribute("errorTitle", "Erreur Système");
        model.addAttribute("errorMessage", "Une erreur inattendue est survenue. Veuillez réessayer plus tard ou contacter le support IT.");
        model.addAttribute("technicalDetails", ex.getMessage());
        return "error-custom";
    }
}
