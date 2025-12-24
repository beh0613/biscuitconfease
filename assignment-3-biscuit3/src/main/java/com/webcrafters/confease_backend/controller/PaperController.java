package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.repository.PaperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.net.MalformedURLException;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/papers")

public class PaperController {

    @Autowired
    private PaperRepository paperRepository;

    private final Path uploadPath = Paths.get("uploads");

    // Get all papers
    @GetMapping
    public ResponseEntity<List<Paper>> getAllPapers() {
        return ResponseEntity.ok(paperRepository.findAll());
    }

    // Get paper by ID
    @GetMapping("/{id}")
    public ResponseEntity<Paper> getPaperById(@PathVariable Long id) {
        return paperRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Removed the 'consumes' part to be more flexible
    @PostMapping
    public ResponseEntity<Paper> createPaper(
            @RequestParam("title") String title,
            @RequestParam("abstractText") String abstractText,
            @RequestParam("track_id") Long trackId,
            @RequestParam("submitted_by") Long submittedBy,
            @RequestParam("file") MultipartFile file) {
        try {
            Paper paper = new Paper();
            paper.setTitle(title);
            paper.setAbstractText(abstractText);
            paper.setTrack_id(trackId);
            paper.setSubmitted_by(submittedBy);
            paper.setStatus("submitted");
            paper.setVersion(1);
            paper.setFile_type("PDF");

            saveFile(file);
            paper.setSubmission_file(file.getOriginalFilename());

            return ResponseEntity.status(HttpStatus.CREATED).body(paperRepository.save(paper));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update existing paper
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Paper> updatePaper(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("abstractText") String abstractText,
            @RequestParam("track_id") Long trackId,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        return paperRepository.findById(id).map(paper -> {
            try {
                paper.setTitle(title);
                paper.setAbstractText(abstractText);
                paper.setTrack_id(trackId);

                if (file != null && !file.isEmpty()) {
                    saveFile(file);
                    paper.setSubmission_file(file.getOriginalFilename());
                }

                return ResponseEntity.ok(paperRepository.save(paper));
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).<Paper>build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete paper
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaper(@PathVariable Long id) {
        if (!paperRepository.existsById(id)) return ResponseEntity.notFound().build();
        paperRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Helper method for file storage
    private void saveFile(MultipartFile file) throws IOException {
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(file.getOriginalFilename());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        return paperRepository.findById(id).map(paper -> {
            try {
                // Absolute path inside the Docker container
                Path filePath = uploadPath.resolve(paper.getSubmission_file()).normalize();
                Resource resource = new UrlResource(filePath.toUri());

                if (resource.exists() && resource.isReadable()) {
                    return ResponseEntity.ok()
                            .contentType(MediaType.APPLICATION_PDF)
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + paper.getSubmission_file() + "\"")
                            .body(resource);
                } else {
                    // Explicitly cast to ResponseEntity<Resource> to satisfy the compiler
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).<Resource>build();
                }
            } catch (MalformedURLException e) {
                // Explicitly cast to ResponseEntity<Resource>
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).<Resource>build();
            }
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).<Resource>build());
    }
}