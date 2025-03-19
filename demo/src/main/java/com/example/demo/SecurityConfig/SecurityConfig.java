package com.example.demo.SecurityConfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
         http
            .csrf(csrf -> csrf.disable())
            
            .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll() //login, register
            .requestMatchers("/login", "/index.html", "/assets/**", "/css/**", "/js/**").permitAll() //public assets
            .requestMatchers("/api/tickets/**").authenticated() //protected ticket api
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                //.defaultSuccessUrl("/scan")
                .successHandler((request, response, authentication) -> { 
                    // Prevent redirect to unwanted pages after login
                    response.setStatus(HttpServletResponse.SC_OK);
                })
            .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS) // Create session always
                .maximumSessions(1) // Optional: Limit to one session per user
                .expiredUrl("/login?expired") // Optional: Redirect if session expires
            );
            return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncode() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
