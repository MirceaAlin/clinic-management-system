package com.example.backend.controller;

import com.example.backend.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public List<PatientDTO> getAllPatients() {
        return patientService.findAll()
                .stream()
                .map(p -> new PatientDTO(
                        p.getId(),
                        p.getFirstName(),
                        p.getLastName(),
                        p.getEmail(),
                        p.getPersonalIdNumber(),
                        p.getAddress(),
                        p.getUniversityFaculty()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable Long id) {
        return patientService.findById(id)
                .map(p -> ResponseEntity.ok(new PatientDTO(
                        p.getId(),
                        p.getFirstName(),
                        p.getLastName(),
                        p.getEmail(),
                        p.getPersonalIdNumber(),
                        p.getAddress(),
                        p.getUniversityFaculty()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id,
                                            @RequestBody Map<String, String> updates) {
        return patientService.findById(id).map(p -> {
            if (updates.containsKey("firstName"))       p.setFirstName(updates.get("firstName"));
            if (updates.containsKey("lastName"))        p.setLastName(updates.get("lastName"));
            if (updates.containsKey("email"))           p.setEmail(updates.get("email"));
            if (updates.containsKey("address"))         p.setAddress(updates.get("address"));
            if (updates.containsKey("personalIdNumber")) p.setPersonalIdNumber(updates.get("personalIdNumber"));
            if (updates.containsKey("universityFaculty")) p.setUniversityFaculty(updates.get("universityFaculty"));
            patientService.save(p);
            return ResponseEntity.ok(new PatientDTO(
                    p.getId(), p.getFirstName(), p.getLastName(), p.getEmail(),
                    p.getPersonalIdNumber(), p.getAddress(), p.getUniversityFaculty()
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}
