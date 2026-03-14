package com.example.backend.domain;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient extends User {

    private String personalIdNumber;
    private String address;
    private String universityFaculty;

    @JsonIgnore
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Consultation> consultations;

    public Patient() {}

    public Patient(String firstName, String lastName, String email, String password, Role role,
                   String personalIdNumber, String address, String universityFaculty) {
        super(firstName, lastName, email, password, role);
        this.personalIdNumber = personalIdNumber;
        this.address = address;
        this.universityFaculty = universityFaculty;
    }

    public String getPersonalIdNumber() { return personalIdNumber; }
    public void setPersonalIdNumber(String personalIdNumber) { this.personalIdNumber = personalIdNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getUniversityFaculty() { return universityFaculty; }
    public void setUniversityFaculty(String universityFaculty) { this.universityFaculty = universityFaculty; }

    public List<Consultation> getConsultations() { return consultations; }
    public void setConsultations(List<Consultation> consultations) { this.consultations = consultations; }
}
