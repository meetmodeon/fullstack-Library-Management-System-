package com.meet.library.LMS.security;

import com.meet.library.LMS.config.OAuth_Config;
import com.meet.library.LMS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
public class SecurityConfig {
    @Value("${frontEnd.url}")
    private String FRONT_URL;

    @Autowired
    private OAuth_Config oAuthConfig;
    @Autowired
    private JwtFilter jwtFilter;
    final String[] swaggerApi={
            "/v2/api-docs/**",
            "/v3/api-docs",
            "/v2/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/meet/docs",
            "/meet/docs/**",
            "/meet/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "/ws/**",
            "/ws",
            "/oauth2/**",
            "/login/**",
            "/login/oauth2/**",
            "/error"
    };
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return  http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request->
                        request.requestMatchers(
                                swaggerApi
                        ).permitAll()
                                .requestMatchers("/common/**").permitAll()
                                .anyRequest().authenticated())
                .oauth2Login(oauth2-> oauth2.successHandler(oAuthConfig))
                .sessionManagement(session-> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();

    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    public UserDetailsService userDetailsService(){
        return userDetailsService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider= new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(){
        return new ProviderManager(authenticationProvider());
    }

    @Bean
    public CorsFilter corsFilter(){
        final UrlBasedCorsConfigurationSource source= new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config=new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of(FRONT_URL));

        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.ORIGIN,
                HttpHeaders.ACCEPT,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.AUTHORIZATION,
                "X-Requested-With",
                HttpHeaders.COOKIE
        ));

        config.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "DELETE",
                        "PUT",
                        "POST",
                        "PATCH"
                )
        );

        source.registerCorsConfiguration("/**",config);
        return new CorsFilter(source);
    }


}
