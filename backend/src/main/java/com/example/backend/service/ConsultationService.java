package com.example.backend.service;

import com.example.backend.domain.Consultation;
import com.example.backend.repository.ConsultationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;

    public ConsultationService(ConsultationRepository consultationRepository) {
        this.consultationRepository = consultationRepository;
    }

    public List<Consultation> findAll() {
        return consultationRepository.findAll();
    }

    public Optional<Consultation> findById(Long id) {
        return consultationRepository.findById(id);
    }

    public Consultation save(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    public void delete(Long id) {
        consultationRepository.deleteById(id);
    }
}
