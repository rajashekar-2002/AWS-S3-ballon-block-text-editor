package com.edit_editor.edit_editor.service;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ListObjectsV2Request;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.edit_editor.edit_editor.Entity.BlogDetails;
import com.edit_editor.edit_editor.repository.BlogDetailsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
@Service
public class DraftManagementService  {
    @Value("${application.bucket.name}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;


    @Autowired
    private BlogDetailsRepository blogDetailsRepository;
    private static final Logger logger = LoggerFactory.getLogger(DraftManagementService.class);

    private final AmazonS3 s3Client;


    private SimpMessagingTemplate messagingTemplate;

    public DraftManagementService(AmazonS3 s3Client, SimpMessagingTemplate messagingTemplate) {
        this.s3Client = s3Client;
        this.messagingTemplate=messagingTemplate;
    }

    public void uploadContent(String email,String blogId,String folderPath, String fileName, String content, Long versionNumber ) {
        try (InputStream contentStream = new ByteArrayInputStream(content.getBytes())) {
            s3Client.putObject(new PutObjectRequest(bucketName, folderPath + "/" + fileName, contentStream, null));
            // Notify the client that the draft has been saved
            String notificationMessage = "Draft saved";
            messagingTemplate.convertAndSend("/sendMessageToUpdateVersionControlWS/draftStatus", notificationMessage);
            //update version only if uploaded successfully
           // updateBlogVersionNumber(email,blogId,versionNumber);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload content to S3", e);
        }
    }


    

    //required to find the latest version file while fetching from s3
    public boolean updateBlogVersionNumber(String email, String blogId, Long newVersion) {
        // Find BlogDetails by email
        Optional<BlogDetails> optionalBlogDetails = blogDetailsRepository.findByEmail(email);

        if (optionalBlogDetails.isPresent()) {
            BlogDetails blogDetails = optionalBlogDetails.get();
            List<BlogDetails.Blog> blogs = blogDetails.getBlogs();

            // Find the blog with the given blogId
            Optional<BlogDetails.Blog> optionalBlog = blogs.stream()
                    .filter(blog -> blog.getBlogId().equals(blogId))
                    .findFirst();

            if (optionalBlog.isPresent()) {
                BlogDetails.Blog blog = optionalBlog.get();
                blog.setVersionNumber(newVersion);

                // Save the updated BlogDetails document
                blogDetailsRepository.save(blogDetails);
                return true;
            }
        }

        return false; // Email or blogId not found
    }


    public void manageDraftFolder(String email, String blogId, String newFileName) {
        String folderPath = email + "/" + blogId + "/draft";
        List<S3ObjectSummary> files = listFilesInFolder(folderPath);

        if (files.size() > 2) {
            // Sort files by last modified date in descending order (latest first)
            List<S3ObjectSummary> sortedFiles = files.stream()
                .sorted((f1, f2) -> f2.getLastModified().compareTo(f1.getLastModified()))
                .collect(Collectors.toList());

            // Remove files beyond the latest two
            List<S3ObjectSummary> filesToDelete = sortedFiles.subList(2, sortedFiles.size());
            for (S3ObjectSummary fileToDelete : filesToDelete) {
                s3Client.deleteObject(bucketName, fileToDelete.getKey());
            }
        }

        // Upload the new file
        //uploadContent(folderPath, newFileName, "{}"); // Placeholder content, replace with actual payload
    }

    private List<S3ObjectSummary> listFilesInFolder(String folderPath) {
        ListObjectsV2Request req = new ListObjectsV2Request()
            .withBucketName(bucketName)
            .withPrefix(folderPath + "/");
        ListObjectsV2Result result = s3Client.listObjectsV2(req);
        return result.getObjectSummaries();
    }



    public boolean doesBlogIdExist(String email, String blogId) {
        //used in new blog if id exist return html content
        // Find the BlogDetails by email
        Optional<BlogDetails> blogDetailsOpt = blogDetailsRepository.findByEmail(email);

        // If BlogDetails found, check if the blogId exists
        if (blogDetailsOpt.isPresent()) {
            BlogDetails blogDetails = blogDetailsOpt.get();
            return blogDetails.getBlogs().stream()
                    .anyMatch(blog -> blog.getBlogId().equals(blogId));
        }

        // If no BlogDetails found, return false
        return false;
    }



    //     public Map<String, String> getContent(String folderPath, String fileName) {


    //     try {
    //         // Retrieve the object from S3
    //         S3Object s3Object = s3Client.getObject(new GetObjectRequest(bucketName, folderPath + "/" + fileName));

    //         // Read the object content
    //         try (BufferedReader reader = new BufferedReader(new InputStreamReader(s3Object.getObjectContent(), StandardCharsets.UTF_8))) {
    //             StringBuilder contentBuilder = new StringBuilder();
    //             String line;
    //             while ((line = reader.readLine()) != null) {
    //                 contentBuilder.append(line);
    //             }

    //             // Parse JSON content
    //             String content = contentBuilder.toString();
    //             return parseJsonContent(content);
    //         }
    //     } catch (Exception e) {
    //         throw new RuntimeException("Failed to retrieve content from S3", e);
    //     }
    // }



    public Map<String, String> getContent(String folderPath) {
        try {
            // List all files in the folder
            List<S3ObjectSummary> objectSummaries = s3Client.listObjects(new ListObjectsRequest()
                    .withBucketName(bucketName)
                    .withPrefix(folderPath + "/")).getObjectSummaries();


            // If no files are found, return an empty map
            if (objectSummaries.isEmpty()) {
                    return new TreeMap<>(); // Return an empty map
            }

            // Find the file with the highest version number
            String latestFile = null;
            int highestVersion = -1;

            for (S3ObjectSummary summary : objectSummaries) {
                String key = summary.getKey();
                String fileName = key.substring(key.lastIndexOf('/') + 1);

                // Adjust the pattern to match files like "55_version.json"
                if (fileName.matches("\\d+_version\\.json")) { // Adjusted pattern
                    int version = Integer.parseInt(fileName.split("_")[0]);
                    if (version > highestVersion) {
                        highestVersion = version;
                        latestFile = key;
                    }
                }
            }

            if (latestFile == null) {
                //throw new RuntimeException("No valid versioned file found in the folder");
                return new TreeMap<>();
            }

            // Retrieve the object with the highest version number
            S3Object s3Object = s3Client.getObject(bucketName, latestFile);

            // Read the object content
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(s3Object.getObjectContent(), StandardCharsets.UTF_8))) {
                StringBuilder contentBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    contentBuilder.append(line);
                }

                // Parse JSON content
                String content = contentBuilder.toString();
                return parseJsonContent(content);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve content from S3", e);
        }
    }


    private Map<String, String> parseJsonContent(String jsonContent) {
        // Use your preferred JSON library to parse the JSON string into a Map
        // For example, using Jackson:
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON content", e);
        }
    }


    
}
