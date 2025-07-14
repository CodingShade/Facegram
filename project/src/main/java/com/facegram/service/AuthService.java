package com.facegram.service;

import com.facegram.dto.AuthResponse;
import com.facegram.dto.LoginRequest;
import com.facegram.dto.RegisterRequest;
import com.facegram.dto.UserDTO;

import com.facegram.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );
        
        String token = tokenProvider.generateToken(authentication);
        UserDTO user = userService.getUserByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        return new AuthResponse(token, user);
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
    UserDTO user = userService.createUser(registerRequest);

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            registerRequest.getEmail(),
            registerRequest.getPassword()
        )
    );

    String token = tokenProvider.generateToken(authentication);
    return new AuthResponse(token, user);
}

}