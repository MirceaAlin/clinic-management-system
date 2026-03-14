package com.example.backend.domain;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;

@Entity
@Table(name = "analyses")
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String testName;
    private String result;
    private String unit;
    private String normalRange;
    private LocalDate testDate;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonIgnore
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "consultation_id", nullable = true)
    @JsonIgnore
    private Consultation consultation;

    public Analysis() {}

    public Analysis(String testName, String result, String unit, String normalRange,
                    LocalDate testDate, Consultation consultation, Patient patient) {
        this.testName = testName;
        this.result = result;
        this.unit = unit;
        this.normalRange = normalRange;
        this.testDate = testDate;
        this.consultation = consultation;
        this.patient = patient;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getNormalRange() { return normalRange; }
    public void setNormalRange(String normalRange) { this.normalRange = normalRange; }

    public LocalDate getTestDate() { return testDate; }
    public void setTestDate(LocalDate testDate) { this.testDate = testDate; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Consultation getConsultation() { return consultation; }
    public void setConsultation(Consultation consultation) { this.consultation = consultation; }
}
