package com.example.backend.controller;

import com.example.backend.domain.Consultation;
import com.example.backend.domain.Doctor;
import com.example.backend.domain.Patient;
import com.example.backend.service.ConsultationService;
import com.example.backend.repository.DoctorRepository;
import com.example.backend.repository.PatientRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public ConsultationController(ConsultationService consultationService,
                                   DoctorRepository doctorRepository,
                                   PatientRepository patientRepository) {
        this.consultationService = consultationService;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public List<ConsultationDTO> getAll() {
        return consultationService.findAll().stream()
                .map(c -> new ConsultationDTO(
                        c.getId(),
                        c.getDoctor()  != null ? c.getDoctor().getId()  : null,
                        c.getPatient() != null ? c.getPatient().getId() : null,
                        c.getDate() != null ? c.getDate().toString() : null,
                        c.getReason(),
                        c.getStatus(),
                        c.getNotes()
                ))
                .toList();
    }

    @GetMapping("/patient/{patientId}")
    public List<Map<String, Object>> getByPatient(@PathVariable Long patientId) {
        return consultationService.findAll().stream()
                .filter(c -> c.getPatient() != null && patientId.equals(c.getPatient().getId()))
                .map(c -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",              c.getId());
                    m.put("date",            c.getDate() != null ? c.getDate().toString() : null);
                    m.put("reason",          c.getReason());
                    m.put("diagnosis",       c.getDiagnosis());
                    m.put("notes",           c.getNotes());
                    m.put("recommendations", c.getRecommendations());
                    m.put("status",          c.getStatus());
                    m.put("doctorName",      c.getDoctor() != null
                            ? c.getDoctor().getFirstName() + " " + c.getDoctor().getLastName()
                            : "");
                    return m;
                })
                .toList();
    }

    @GetMapping("/doctor/{doctorId}")
    public List<ConsultationDTO> getByDoctor(@PathVariable Long doctorId) {
        return consultationService.findAll().stream()
                .filter(c -> c.getDoctor() != null && doctorId.equals(c.getDoctor().getId()))
                .map(c -> new ConsultationDTO(
                        c.getId(),
                        c.getDoctor().getId(),
                        c.getPatient() != null ? c.getPatient().getId() : null,
                        c.getDate() != null ? c.getDate().toString() : null,
                        c.getReason(),
                        c.getStatus(),
                        c.getNotes()
                ))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ConsultationRequest req) {
        if (req.doctorId() == null || req.patientId() == null) {
            return ResponseEntity.badRequest().body("doctorId și patientId sunt obligatorii.");
        }

        Doctor doctor = doctorRepository.findById(req.doctorId()).orElse(null);
        if (doctor == null) return ResponseEntity.badRequest().body("Doctor negăsit.");

        Patient patient = patientRepository.findById(req.patientId()).orElse(null);
        if (patient == null) return ResponseEntity.badRequest().body("Pacient negăsit.");

        Consultation c = new Consultation();
        c.setDate(LocalDate.parse(req.date()));
        c.setReason(req.reason() != null ? req.reason() : "Consultație");
        c.setStatus("Programată");
        c.setDoctor(doctor);
        c.setPatient(patient);

        consultationService.save(c);

        return ResponseEntity.ok(new ConsultationDTO(
                c.getId(), doctor.getId(), patient.getId(),
                c.getDate().toString(), c.getReason(), c.getStatus(), c.getNotes()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateConsultation(@PathVariable Long id,
                                                 @RequestBody Map<String, String> updates) {
        Consultation c = consultationService.findById(id).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();

        if (updates.containsKey("diagnosis"))       c.setDiagnosis(updates.get("diagnosis"));
        if (updates.containsKey("notes"))           c.setNotes(updates.get("notes"));
        if (updates.containsKey("recommendations")) c.setRecommendations(updates.get("recommendations"));
        if (updates.containsKey("status"))          c.setStatus(updates.get("status"));

        consultationService.save(c);

        return ResponseEntity.ok(new ConsultationDTO(
                c.getId(),
                c.getDoctor().getId(),
                c.getPatient().getId(),
                c.getDate().toString(),
                c.getReason(),
                c.getStatus(),
                c.getNotes()
        ));
    }

    @PutMapping("/{id}/finish")
    public ResponseEntity<?> finishConsultation(@PathVariable Long id) {
        Consultation c = consultationService.findById(id).orElse(null);
        if (c == null) return ResponseEntity.notFound().build();

        c.setStatus("Finalizată");
        consultationService.save(c);

        return ResponseEntity.ok(new ConsultationDTO(
                c.getId(), c.getDoctor().getId(), c.getPatient().getId(),
                c.getDate().toString(), c.getReason(), c.getStatus(), c.getNotes()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteConsultation(@PathVariable Long id) {
        if (!consultationService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        consultationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
