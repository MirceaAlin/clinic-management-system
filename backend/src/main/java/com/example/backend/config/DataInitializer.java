package com.example.backend.config;

import com.example.backend.domain.*;
import com.example.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    @Profile("!test")
    CommandLineRunner initData(
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            ConsultationRepository consultationRepository,
            AnalysisRepository analysisRepository
    ) {
        return args -> {
            if (userRepository.count() > 0) return;

            Admin admin = new Admin("Admin", "STUDMED", "admin@studmed.ro", "admin123", Role.ADMIN);
            userRepository.save(admin);

            Doctor doctor1 = new Doctor("Maria", "Popa", "doctor@studmed.ro", "doctor123",
                    Role.DOCTOR, "Medicina Generala", "Ambulatoriu");
            Doctor doctor2 = new Doctor("Ion", "Dumitrescu", "ion.d@studmed.ro", "doctor123",
                    Role.DOCTOR, "Cardiologie", "Cardiologie");
            doctorRepository.save(doctor1);
            doctorRepository.save(doctor2);

            Patient p1 = new Patient("Ana", "Ionescu", "patient@studmed.ro", "patient123",
                    Role.PATIENT, "2001050110001", "Str. Mihai Eminescu 5, Cluj-Napoca",
                    "Facultatea de Informatica");
            Patient p2 = new Patient("Mihai", "Popescu", "mihai.p@studmed.ro", "patient123",
                    Role.PATIENT, "2000120210002", "Bd. Unirii 12, Bucuresti",
                    "Facultatea de Drept");
            Patient p3 = new Patient("Elena", "Constantin", "elena.c@studmed.ro", "patient123",
                    Role.PATIENT, "2002030310003", "Calea Victoriei 88, Bucuresti",
                    "Facultatea de Medicina");
            patientRepository.save(p1);
            patientRepository.save(p2);
            patientRepository.save(p3);

            Consultation c1 = new Consultation(LocalDate.of(2025, 10, 15), "Control periodic",
                    "Finalizata", "Anemie usoara", "Valori Hgb usor scazute.",
                    "Supliment fier 30mg/zi.", doctor1, p1);
            Consultation c2 = new Consultation(LocalDate.of(2025, 12, 10), "Control Vitamina D",
                    "Programata", null, null, null, doctor1, p1);
            Consultation c3 = new Consultation(LocalDate.of(2025, 11, 1), "Consult cardiologic",
                    "Finalizata", "Prediabet, hipercolesterolemie", "EKG normal.",
                    "Dieta hipoglucidica.", doctor2, p2);
            Consultation c4 = new Consultation(LocalDate.of(2025, 11, 5), "Analize de rutina",
                    "Finalizata", "Stare buna", "In limite normale.",
                    "Continuati dieta echilibrata.", doctor1, p3);
            consultationRepository.save(c1);
            consultationRepository.save(c2);
            consultationRepository.save(c3);
            consultationRepository.save(c4);

            analysisRepository.save(new Analysis("Hemoglobina", "11.8", "g/dL",  "12.0-16.0", LocalDate.of(2025, 10, 15), c1, p1));
            analysisRepository.save(new Analysis("Glicemie",    "98",   "mg/dL", "70-110",    LocalDate.of(2025, 10, 15), c1, p1));
            analysisRepository.save(new Analysis("Colesterol",  "185",  "mg/dL", "<200",      LocalDate.of(2025,  9, 20), c1, p1));
            analysisRepository.save(new Analysis("Vitamina D",  "22",   "ng/mL", "30-100",    LocalDate.of(2025,  9, 20), c1, p1));
            analysisRepository.save(new Analysis("Glicemie",    "125",  "mg/dL", "70-110",    LocalDate.of(2025, 11,  1), c3, p2));
            analysisRepository.save(new Analysis("Colesterol",  "220",  "mg/dL", "<200",      LocalDate.of(2025, 10, 10), c3, p2));
            analysisRepository.save(new Analysis("Hemoglobina", "14.2", "g/dL",  "13.5-17.5", LocalDate.of(2025, 10, 10), c3, p2));
            analysisRepository.save(new Analysis("Fier seric",  "68",   "ug/dL", "50-170",    LocalDate.of(2025, 11,  5), c4, p3));
            analysisRepository.save(new Analysis("TSH",         "3.2",  "mIU/L", "0.4-4.0",   LocalDate.of(2025, 10, 25), c4, p3));

            System.out.println("Date initiale MEDSTUD populate cu succes!");
        };
    }
}
