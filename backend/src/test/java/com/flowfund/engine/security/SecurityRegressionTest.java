package com.flowfund.engine.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowfund.engine.entity.User;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SecurityRegressionTest {
    @Test
    void tokenRequiresTheCorrectSigningSecret() {
        JwtUtil signer = new JwtUtil("first-random-test-secret-32-bytes-long");
        JwtUtil other = new JwtUtil("other-random-test-secret-32-bytes-long");
        String token = signer.generateToken("person@example.com");
        assertEquals("person@example.com", signer.extractEmail(token));
        assertNull(other.extractEmail(token));
        assertNull(signer.extractEmail("not-a-jwt"));
    }

    @Test
    void userJsonDoesNotExposePasswordHash() throws Exception {
        User user = new User();
        user.setPassword("secret-hash");
        String json = new ObjectMapper().writeValueAsString(user);
        assertFalse(json.contains("secret-hash"));
        assertFalse(json.contains("password"));
    }
}
