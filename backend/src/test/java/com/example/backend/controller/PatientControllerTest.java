package com.example.backend.controller;

import com.example.backend.domain.Patient;
import com.example.backend.domain.Role;
import com.example.backend.repository.PatientRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class PatientControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private PatientRepository patientRepository;
    @Autowired private UserRepository userRepository;

    private Patient savedPatient;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        Patient p = new Patient("Maria", "Ionescu", "maria@test.ro", "pass",
                Role.PATIENT, "2000101123456", "Str. Florilor 1", "Medicina");
        savedPatient = patientRepository.save(p);
    }

    @Test
    void getAll_returneazaListaPacienti() throws Exception {
        mockMvc.perform(get("/api/patients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].firstName").value("Maria"));
    }

    @Test
    void getById_returneazaPacientulCorect() throws Exception {
        mockMvc.perform(get("/api/patients/" + savedPatient.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Ionescu"))
                .andExpect(jsonPath("$.email").value("maria@test.ro"));
    }

    @Test
    void getById_cuIdInvalid_returneaza404() throws Exception {
        mockMvc.perform(get("/api/patients/99999"))
                .andExpect(status().isNotFound());
    }
}
