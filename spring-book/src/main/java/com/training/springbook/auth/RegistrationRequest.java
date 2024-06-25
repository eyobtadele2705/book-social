package com.training.springbook.auth;

import lombok.Builder;
import lombok.Data;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
@Data
@Builder
public class RegistrationRequest {

    @NotEmpty(message = "First Name is mandatory")
    @NotNull(message = "First Name is mandatory")
    private String firstName;
    @NotEmpty(message = "Last Name is mandatory")
    @NotNull(message = "Last Name is mandatory")
    private String lastName;
    @Email(message = "Invalid email address")
    @NotEmpty(message = "Email is mandatory")
    @NotNull(message = "Email is mandatory")
    private String email;
    @NotEmpty(message = "Password is mandatory")
    @NotNull(message = "Password is mandatory")
    @Size(min = 8, message = "Password should be at least 8 characters long.")
    private String password;


}
