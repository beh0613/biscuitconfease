package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.repository.PaperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/papers")
public class PaperController {

    @Autowired
    private PaperRepository paperRepository;

    private final Path uploadPath = Paths.get("uploads"); // Docker volume mapped folder

    // Get all papers
    @GetMapping
    public ResponseEntity<List<Paper>> getAllPapers() {
        return ResponseEntity.ok(paperRepository.findAll());
    }

    // Get paper by ID
    @GetMapping("/{id}")
    public ResponseEntity<Paper> getPaperById(@PathVariable Long id) {
        Optional<Paper> paper = paperRepository.findById(id);
        return paper.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Download PDF
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadPaper(@PathVariable Long id) {
        Optional<Paper> paperOpt = paperRepository.findById(id);
        if (paperOpt.isEmpty()) return ResponseEntity.notFound().build();

        Paper paper = paperOpt.get();
        Path filePath = uploadPath.resolve(paper.getSubmission_file());
        if (!Files.exists(filePath)) return ResponseEntity.notFound().build();

        try {
            Resource resource = new UrlResource(filePath.toUri());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + paper.getSubmission_file() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create a new paper with file upload
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Paper> createPaper(@RequestPart("paper") Paper paper,
                                             @RequestPart("file") MultipartFile file) {
        try {
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(file.getOriginalFilename());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            paper.setSubmission_file(file.getOriginalFilename());
            Paper savedPaper = paperRepository.save(paper);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPaper);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update existing paper (with optional file upload)
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Paper> updatePaper(@PathVariable Long id,
                                             @RequestPart("paper") Paper paperDetails,
                                             @RequestPart(name = "file", required = false) MultipartFile file) {
        Optional<Paper> optionalPaper = paperRepository.findById(id);
        if (optionalPaper.isEmpty()) return ResponseEntity.notFound().build();

        Paper paper = optionalPaper.get();
        // Update fields
        paper.setTrack_id(paperDetails.getTrack_id());
        paper.setTitle(paperDetails.getTitle());
        paper.setAbstractText(paperDetails.getAbstractText());
        paper.setFile_type(paperDetails.getFile_type());
        paper.setVersion(paperDetails.getVersion());
        paper.setStatus(paperDetails.getStatus());
        paper.setSubmitted_by(paperDetails.getSubmitted_by());

        // If file uploaded, save it
        if (file != null) {
            try {
                Path filePath = uploadPath.resolve(file.getOriginalFilename());
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                paper.setSubmission_file(file.getOriginalFilename());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        Paper updatedPaper = paperRepository.save(paper);
        return ResponseEntity.ok(updatedPaper);
    }

    // Delete paper
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaper(@PathVariable Long id) {
        if (!paperRepository.existsById(id)) return ResponseEntity.notFound().build();

        paperRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
