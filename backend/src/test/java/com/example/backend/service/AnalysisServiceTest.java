package com.example.backend.service;

import com.example.backend.domain.Analysis;
import com.example.backend.domain.Patient;
import com.example.backend.domain.Role;
import com.example.backend.repository.AnalysisRepository;
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
class AnalysisServiceTest {

    @Mock    AnalysisRepository repository;
    @InjectMocks AnalysisService analysisService;

    private Patient makePatient() {
        return new Patient("P", "P", "p@p.ro", "x", Role.PATIENT, "", "", "");
    }

    @Test
    void findAll_returneazaToateAnalizele() {
        Patient p = makePatient();
        Analysis a1 = new Analysis("Glicemie", "98", "mg/dL", "70-110", LocalDate.now(), null, p);
        Analysis a2 = new Analysis("TSH",      "2.1", "mIU/L", "0.4-4", LocalDate.now(), null, p);
        when(repository.findAll()).thenReturn(List.of(a1, a2));

        List<Analysis> result = analysisService.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    void findByPatientId_filtreazaCorect() {
        Patient p = makePatient();
        Analysis a = new Analysis("Colesterol", "185", "mg/dL", "<200", LocalDate.now(), null, p);
        when(repository.findByPatientId(1L)).thenReturn(List.of(a));

        List<Analysis> result = analysisService.findByPatientId(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTestName()).isEqualTo("Colesterol");
    }

    @Test
    void findById_returneazaAnaliza() {
        Analysis a = new Analysis("Fier seric", "72", "µg/dL", "50-170", LocalDate.now(), null, makePatient());
        when(repository.findById(1L)).thenReturn(Optional.of(a));

        Optional<Analysis> result = analysisService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getTestName()).isEqualTo("Fier seric");
    }

    @Test
    void save_persistaAnaliza() {
        Patient p = makePatient();
        Analysis a = new Analysis("Vit D", "28", "ng/mL", "30-100", LocalDate.now(), null, p);
        when(repository.save(a)).thenReturn(a);

        Analysis result = analysisService.save(a);

        assertThat(result.getTestName()).isEqualTo("Vit D");
        verify(repository).save(a);
    }

    @Test
    void delete_apeleazaDeleteById() {
        analysisService.delete(7L);
        verify(repository).deleteById(7L);
    }
}
