package com.example.backend.controller;

import com.example.backend.domain.Consultation;
import com.example.backend.domain.Doctor;
import com.example.backend.service.ConsultationService;
import com.example.backend.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final ConsultationService consultationService;

    public DoctorController(DoctorService doctorService,
                             ConsultationService consultationService) {
        this.doctorService = doctorService;
        this.consultationService = consultationService;
    }

    @GetMapping
    public List<DoctorDTO> getAllDoctors() {
        return doctorService.findAll().stream()
                .map(d -> new DoctorDTO(
                        d.getId(),
                        d.getFirstName(),
                        d.getLastName(),
                        d.getSpecialization(),
                        d.getDepartment()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctor(@PathVariable Long id) {
        return doctorService.findById(id)
                .map(d -> ResponseEntity.ok(new DoctorDTO(
                        d.getId(), d.getFirstName(), d.getLastName(),
                        d.getSpecialization(), d.getDepartment()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{doctorId}/patients")
    public List<PatientDTO> getPatientsForDoctor(@PathVariable Long doctorId) {
        return consultationService.findAll().stream()
                .filter(c -> c.getDoctor() != null && doctorId.equals(c.getDoctor().getId()))
                .filter(c -> c.getPatient() != null)
                .map(Consultation::getPatient)
                .distinct()
                .map(p -> new PatientDTO(
                        p.getId(), p.getFirstName(), p.getLastName(), p.getEmail(),
                        p.getPersonalIdNumber(), p.getAddress(), p.getUniversityFaculty()
                ))
                .toList();
    }
}
