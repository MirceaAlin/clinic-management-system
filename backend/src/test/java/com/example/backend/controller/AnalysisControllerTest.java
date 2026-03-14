package com.example.backend.controller;

import com.example.backend.domain.Analysis;
import com.example.backend.domain.Patient;
import com.example.backend.domain.Role;
import com.example.backend.repository.AnalysisRepository;
import com.example.backend.repository.PatientRepository;
import com.example.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AnalysisControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private AnalysisRepository analysisRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ObjectMapper objectMapper;

    private Patient savedPatient;

    @BeforeEach
    void setUp() {
        analysisRepository.deleteAll();
        userRepository.deleteAll();

        Patient p = new Patient("Ion", "Test", "ion@test.ro", "pass",
                Role.PATIENT, "1234567890123", "Str. Test", "Informatica");
        savedPatient = patientRepository.save(p);

        Analysis a = new Analysis("Glicemie", "98", "mg/dL", "70-110",
                LocalDate.of(2025, 10, 1), null, savedPatient);
        analysisRepository.save(a);
    }

    @Test
    void getAll_returneazaListaAnalize() throws Exception {
        mockMvc.perform(get("/api/analyses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].testName").value("Glicemie"));
    }

    @Test
    void getByPatient_returneazaAnalizeleCorecte() throws Exception {
        mockMvc.perform(get("/api/analyses/patient/" + savedPatient.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].testName").value("Glicemie"))
                .andExpect(jsonPath("$[0].result").value("98"));
    }

    @Test
    void create_adaugaAnaliza() throws Exception {
        Map<String, Object> body = Map.of(
                "testName",    "Hemoglobina",
                "result",      "13.5",
                "unit",        "g/dL",
                "normalRange", "12.0-16.0",
                "testDate",    "2025-11-01",
                "patientId",   savedPatient.getId()
        );

        mockMvc.perform(post("/api/analyses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.testName").value("Hemoglobina"));
    }

    @Test
    void create_cuPatientIdInvalid_returneaza400() throws Exception {
        Map<String, Object> body = Map.of(
                "testName", "Test", "result", "1", "unit", "u",
                "normalRange", "0-100", "testDate", "2025-01-01",
                "patientId", 99999L
        );

        mockMvc.perform(post("/api/analyses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }
}
