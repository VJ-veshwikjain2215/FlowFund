package com.flowfund.engine.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowfund.engine.controller.FinanceController;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FinanceIsolationTest {
    @Test
    @SuppressWarnings("unchecked")
    void snapshotLookupUsesAuthenticatedIdentity() throws Exception {
        JdbcTemplate jdbc = new JdbcTemplate() {
            @Override
            public <T> List<T> query(String sql, RowMapper<T> mapper, Object... args) {
                org.junit.jupiter.api.Assertions.assertTrue(sql.contains("WHERE u.email = ?"));
                if ("alice@example.com".equals(args[0])) {
                    return (List<T>) List.of("{\"dashboard\":{\"has_data\":true,\"safe_spend\":10},\"transactions\":[]}");
                }
                return List.of();
            }
        };
        Authentication alice = new UsernamePasswordAuthenticationToken("alice@example.com", null);
        Authentication bob = new UsernamePasswordAuthenticationToken("bob@example.com", null);
        FinanceController controller = new FinanceController(jdbc, new ObjectMapper());

        assertEquals(10, ((Map<String, Object>) controller.dashboard(alice)).get("safe_spend"));
        assertEquals(false, ((Map<String, Object>) controller.dashboard(bob)).get("has_data"));
    }
}
