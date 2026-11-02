package com.flowfund.engine.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.HttpClientErrorException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {
    private final JdbcTemplate jdbc;
    private final ObjectMapper mapper;
    private final RestTemplate client;
    @Value("${app.ai-service.base-url}") private String aiUrl;
    @Value("${app.ai-service.secret}") private String aiSecret;

    public FinanceController(JdbcTemplate jdbc, ObjectMapper mapper) {
        this.jdbc = jdbc;
        this.mapper = mapper;
        SimpleClientHttpRequestFactory requests = new SimpleClientHttpRequestFactory();
        requests.setConnectTimeout(5000);
        requests.setReadTimeout(30000);
        this.client = new RestTemplate(requests);
    }

    private Map<String, Object> snapshot(Authentication auth) throws IOException {
        List<String> rows = jdbc.query("SELECT s.payload FROM finance_snapshots s JOIN users u ON u.id = s.user_id WHERE u.email = ?",
                (rs, n) -> rs.getString(1), auth.getName());
        if (rows.isEmpty()) return Map.of("dashboard", Map.of("has_data", false), "transactions", List.of());
        return mapper.readValue(rows.get(0), new TypeReference<Map<String, Object>>() {});
    }

    @GetMapping("/dashboard")
    public Object dashboard(Authentication auth) throws IOException { return snapshot(auth).get("dashboard"); }

    @GetMapping("/transactions")
    public Object transactions(Authentication auth) throws IOException { return snapshot(auth).get("transactions"); }

    @PostMapping("/upload-csv")
    public Object upload(@RequestParam("file") MultipartFile file, Authentication auth) throws IOException {
        if (file.isEmpty() || file.getSize() > 5 * 1024 * 1024)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select a CSV file up to 5 MB");
        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override public String getFilename() { return "transactions.csv"; }
        };
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", resource);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("X-Service-Key", aiSecret);
        try {
            String result = client.postForObject(aiUrl + "/upload-csv", new HttpEntity<>(body, headers), String.class);
            Map<String, Object> parsed = mapper.readValue(result, new TypeReference<Map<String, Object>>() {});
            if (!(parsed.get("dashboard") instanceof Map) || !(parsed.get("transactions") instanceof List))
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Invalid analysis response");
            jdbc.update("INSERT INTO finance_snapshots (user_id, payload) SELECT id, ? FROM users WHERE email = ? ON CONFLICT (user_id) DO UPDATE SET payload = EXCLUDED.payload", result, auth.getName());
            return parsed.get("dashboard");
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode().value() == 400 || ex.getStatusCode().value() == 413) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to import CSV. Check its columns, dates and size.");
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Analysis service could not process the file");
        } catch (RestClientException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Analysis service could not process the file");
        }
    }

    @PostMapping("/vacation-planner")
    public Object vacation(@RequestBody Map<String, Object> request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Service-Key", aiSecret);
        try { return client.postForObject(aiUrl + "/vacation-planner", new HttpEntity<>(request, headers), Object.class); }
        catch (RestClientException ex) { throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Analysis service unavailable"); }
    }
}
