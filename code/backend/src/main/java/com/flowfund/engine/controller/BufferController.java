package com.flowfund.engine.controller;

import com.flowfund.engine.entity.Buffer;
import com.flowfund.engine.service.PipelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/buffer")
public class BufferController {
    @Autowired private PipelineService pipelineService;

    @GetMapping
    public Buffer get() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return pipelineService.runFullPipeline(email, null);
    }

    @PostMapping("/calculate")
    public Buffer calculate(@RequestParam(required = false) MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return pipelineService.runFullPipeline(email, file);
    }

    @GetMapping("/insights")
    public List<String> getInsights() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return pipelineService.runFullPipeline(email, null).getInsights();
    }
}
