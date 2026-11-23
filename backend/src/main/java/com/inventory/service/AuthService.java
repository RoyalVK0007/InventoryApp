package com.inventory.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.inventory.dto.AuthResponse;
import com.inventory.dto.GoogleAuthRequest;
import com.inventory.entity.AppUser;
import com.inventory.repository.UserRepository;
import com.inventory.security.GoogleTokenVerifier;
import com.inventory.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final GoogleTokenVerifier googleTokenVerifier;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        GoogleIdToken.Payload payload = googleTokenVerifier.verify(request.getIdToken());

        String googleSubject = payload.getSubject();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");

        AppUser user = userRepository.findByGoogleSubject(googleSubject)
                .orElseGet(() -> userRepository.save(AppUser.builder()
                        .googleSubject(googleSubject)
                        .email(email)
                        .name(name)
                        .pictureUrl(pictureUrl)
                        .build()));

        // Update name/picture in case they changed
        user.setName(name);
        user.setPictureUrl(pictureUrl);

        String token = jwtUtil.generateToken(email);

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .pictureUrl(user.getPictureUrl())
                .build();
    }
}
