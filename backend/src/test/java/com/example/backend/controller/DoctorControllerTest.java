package com.example.backend.controller;

import com.example.backend.domain.Doctor;
import com.example.backend.domain.Role;
import com.example.backend.repository.DoctorRepository;
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
class DoctorControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private UserRepository userRepository;

    private Doctor savedDoctor;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        Doctor d = new Doctor("Ion", "Popescu", "ion.pop@test.ro", "pass",
                Role.DOCTOR, "Cardiologie", "Cardiologie");
        savedDoctor = doctorRepository.save(d);
    }

    @Test
    void getAll_returneazaListaDoctori() throws Exception {
        mockMvc.perform(get("/api/doctors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].specialization").value("Cardiologie"));
    }

    @Test
    void getById_returneazaDoctorulCorect() throws Exception {
        mockMvc.perform(get("/api/doctors/" + savedDoctor.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Ion"))
                .andExpect(jsonPath("$.department").value("Cardiologie"));
    }

    @Test
    void getById_cuIdInvalid_returneaza404() throws Exception {
        mockMvc.perform(get("/api/doctors/99999"))
                .andExpect(status().isNotFound());
    }
}
