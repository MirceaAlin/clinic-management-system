package com.example.backend.domain;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "doctors")
public class Doctor extends User {

    private String specialization;
    private String department;

    @JsonIgnore
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Consultation> consultations;

    public Doctor() {
        super();
    }

    public Doctor(String firstName, String lastName, String email, String password, Role role,
                  String specialization, String department) {
        super(firstName, lastName, email, password, role);
        this.specialization = specialization;
        this.department = department;
    }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public List<Consultation> getConsultations() { return consultations; }
    public void setConsultations(List<Consultation> consultations) { this.consultations = consultations; }
}
