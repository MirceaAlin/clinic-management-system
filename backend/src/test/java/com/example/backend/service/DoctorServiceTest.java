package com.example.backend.service;

import com.example.backend.domain.Doctor;
import com.example.backend.domain.Role;
import com.example.backend.repository.DoctorRepository;
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
class DoctorServiceTest {

    @Mock    DoctorRepository doctorRepository;
    @InjectMocks DoctorService doctorService;

    @Test
    void findAll_returneazaTotiDoctorii() {
        Doctor d1 = new Doctor("Maria", "Popa", "m@test.ro", "p", Role.DOCTOR, "Generală", "Ambulator");
        Doctor d2 = new Doctor("Ion",   "Dum",  "i@test.ro", "p", Role.DOCTOR, "Cardiologie", "Cardio");
        when(doctorRepository.findAll()).thenReturn(List.of(d1, d2));

        List<Doctor> result = doctorService.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    void findById_returneazaDoctorulDacaExista() {
        Doctor d = new Doctor("Maria", "Popa", "m@test.ro", "p", Role.DOCTOR, "Generală", "Ambulator");
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(d));

        Optional<Doctor> result = doctorService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getSpecialization()).isEqualTo("Generală");
    }

    @Test
    void save_apeleazaRepository() {
        Doctor d = new Doctor("X", "Y", "x@y.ro", "p", Role.DOCTOR, "S", "D");
        when(doctorRepository.save(d)).thenReturn(d);

        Doctor result = doctorService.save(d);

        assertThat(result).isNotNull();
        verify(doctorRepository).save(d);
    }

    @Test
    void delete_apeleazaDeleteById() {
        doctorService.delete(3L);
        verify(doctorRepository).deleteById(3L);
    }
}
