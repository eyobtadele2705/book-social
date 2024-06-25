package com.training.springbook;

import com.training.springbook.roles.Role;
import com.training.springbook.roles.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class SpringBookApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBookApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(RoleRepository roleRepository){
        return args -> {
            if (roleRepository.findByName("USER").isEmpty()){
                roleRepository.save(
                        Role.builder()
                                .name("USER").build()
                );
            }
        };
    }
}

//10:29:00

