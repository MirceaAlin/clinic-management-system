package com.example.backend.service;

import com.example.backend.domain.Consultation;
import com.example.backend.domain.Doctor;
import com.example.backend.domain.Patient;
import com.example.backend.domain.Role;
import com.example.backend.repository.ConsultationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConsultationServiceTest {

    @Mock    ConsultationRepository consultationRepository;
    @InjectMocks ConsultationService consultationService;

    private Consultation makeConsultation() {
        Doctor  d = new Doctor ("Dr", "X", "d@x.ro", "p", Role.DOCTOR,  "Gen", "Amb");
        Patient p = new Patient("P",  "P", "p@p.ro", "p", Role.PATIENT, "",    "",   "");
        return new Consultation(LocalDate.now(), "Control", "Programată",
                null, null, null, d, p);
    }

    @Test
    void findAll_returneazaToateConsultatiile() {
        Consultation c1 = makeConsultation();
        Consultation c2 = makeConsultation();
        when(consultationRepository.findAll()).thenReturn(List.of(c1, c2));

        List<Consultation> result = consultationService.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    void findById_returneazaConsultatia() {
        Consultation c = makeConsultation();
        when(consultationRepository.findById(1L)).thenReturn(Optional.of(c));

        Optional<Consultation> result = consultationService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getReason()).isEqualTo("Control");
    }

    @Test
    void save_persistaConultatia() {
        Consultation c = makeConsultation();
        when(consultationRepository.save(c)).thenReturn(c);

        Consultation result = consultationService.save(c);

        assertThat(result).isNotNull();
        verify(consultationRepository).save(c);
    }

    @Test
    void delete_apeleazaDeleteById() {
        consultationService.delete(2L);
        verify(consultationRepository).deleteById(2L);
    }
}
