package com.edit_editor.edit_editor.controller;




import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edit_editor.edit_editor.service.AWSbucketService;
import com.edit_editor.edit_editor.service.GetSetDraftId;

@RestController
public class FileUploadController {

    @Value("${image.upload.dir}")
    private String uploadDir;

    @Autowired
    private AWSbucketService awSbucketService;

    @Autowired
    private GetSetDraftId getSetDraftId;

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> handleFileUpload( @RequestParam("file") MultipartFile file)
     {

        String blogId= getSetDraftId.getDraftId();

        String email="r@gmail.com";
        if (file.isEmpty()) {
            return new ResponseEntity<>(Map.of("error", "No file uploaded"), HttpStatus.BAD_REQUEST);
        }

        try {
            // Create the directory if it does not exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file to the directory
            String fileName = file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            file.transferTo(filePath.toFile());
            String folderPath = email + "/" + blogId + "/images";
            // Assuming the imageUrl is the file's relative path
            List<String> imageUrlAndFilename = awSbucketService.uploadFile(email, blogId, folderPath, file);

            // Return a success response with JSON
            Map<String, Object> response = new HashMap<>();
            response.put("imageUrl", imageUrlAndFilename.get(0)); // URL of the uploaded image
            response.put("fileName", imageUrlAndFilename.get(1)); // Actual filename

            // Return a success response with JSON
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace(); // Log the error
            return new ResponseEntity<>(Map.of("error", "File upload failed"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





    @GetMapping("/delete-image")
    public ResponseEntity<Map<String, String>> deleteImage(@RequestParam("filename") String filename) {
        // Perform the delete operation for the given filename
        // For example, delete the image from storage
        String email="r@gmail.com";
        String folderPath = email + "/" + getSetDraftId.getDraftId() + "/images";
        logger.info("~~~~~~~~~~~~~~~~~~~~~{}",folderPath);
        awSbucketService.deleteFileWithPathSpecified(folderPath,filename);
        return ResponseEntity.ok(Map.of("status", "success"));
    }




}
