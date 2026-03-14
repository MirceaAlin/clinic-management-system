package com.example.backend.service;

import com.example.backend.domain.Patient;
import com.example.backend.domain.Role;
import com.example.backend.repository.PatientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock    PatientRepository patientRepository;
    @InjectMocks PatientService patientService;

    @Test
    void findAll_returneazaTotiPacientii() {
        Patient p1 = new Patient("Ana", "Pop", "ana@test.ro", "p", Role.PATIENT, "", "", "");
        Patient p2 = new Patient("Ion", "Ion", "ion@test.ro", "p", Role.PATIENT, "", "", "");
        when(patientRepository.findAll()).thenReturn(List.of(p1, p2));

        List<Patient> result = patientService.findAll();

        assertThat(result).hasSize(2);
        verify(patientRepository, times(1)).findAll();
    }

    @Test
    void findById_returneazaPacientulDacaExista() {
        Patient p = new Patient("Ana", "Pop", "ana@test.ro", "p", Role.PATIENT, "", "", "");
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        Optional<Patient> result = patientService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getFirstName()).isEqualTo("Ana");
    }

    @Test
    void findById_returneazaEmptyDacaNuExista() {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Patient> result = patientService.findById(99L);

        assertThat(result).isEmpty();
    }

    @Test
    void save_apeleazaRepository() {
        Patient p = new Patient("Test", "Test", "t@t.ro", "p", Role.PATIENT, "", "", "");
        when(patientRepository.save(p)).thenReturn(p);

        Patient result = patientService.save(p);

        assertThat(result).isNotNull();
        verify(patientRepository, times(1)).save(p);
    }

    @Test
    void delete_apeleazaDeleteById() {
        patientService.delete(5L);
        verify(patientRepository, times(1)).deleteById(5L);
    }
}
