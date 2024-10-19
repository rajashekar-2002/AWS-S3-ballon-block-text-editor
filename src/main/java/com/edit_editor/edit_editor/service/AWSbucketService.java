package com.edit_editor.edit_editor.service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
// @Service
// @Slf4j
// @SuppressWarnings("all")
// public class AWSbucketService {
//     @Value("${application.bucket.name}")
//     private String bucketName;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ListObjectsV2Request;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;

import lombok.extern.slf4j.Slf4j;

//     @Autowired
//     private AmazonS3 s3Client;

//     public String uploadFile(MultipartFile file) {
//         File fileObj = convertMultiPartFileToFile(file);
//         String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//         s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
//         fileObj.delete();
//         return "File uploaded : " + fileName;
//     }


//     public byte[] downloadFile(String fileName) {
//         S3Object s3Object = s3Client.getObject(bucketName, fileName);
//         S3ObjectInputStream inputStream = s3Object.getObjectContent();
//         try {
//             byte[] content = IOUtils.toByteArray(inputStream);
//             return content;
//         } catch (IOException e) {
//             e.printStackTrace();
//         }
//         return null;
//     }


//     public String deleteFile(String fileName) {
//         s3Client.deleteObject(bucketName, fileName);
//         return fileName + " removed ...";
//     }

//     private File convertMultiPartFileToFile(MultipartFile file) {
//         File convertedFile = new File(file.getOriginalFilename());
//         try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
//             fos.write(file.getBytes());
//         } catch (IOException e) {
//             log.error("Error converting multipartFile to file", e);
//         }
//         return convertedFile;
//     }

// }


















@Service
@Slf4j
@SuppressWarnings("all")
public class AWSbucketService {
    @Value("${application.bucket.name}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Autowired
    private AmazonS3 s3Client;

    private static final Logger logger = LoggerFactory.getLogger(AWSbucketService.class);


    public List<String> uploadFile(String email, String id, String folderPath, MultipartFile file) {
    Long timeStamp = System.currentTimeMillis();
    String fileName = timeStamp + "_" + file.getOriginalFilename();

    // Encode the email and filename to handle special characters
    String encodedEmail = EncodeToAWSs3FileNameFormat(email);
    String encodedFileName = EncodeToAWSs3FileNameFormat(fileName);
    String encodedFolderPath = EncodeToAWSs3FileNameFormat(folderPath);

    String fullPath = encodedEmail + "/" + id + "/" + "images" + "/" + encodedFileName;
    String s3Path = folderPath + "/" + fileName; // Actual path in S3

    try (InputStream inputStream = file.getInputStream()) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize()); // Set content length

        // Create PutObjectRequest with content length
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3Path, inputStream, metadata);

        s3Client.putObject(putObjectRequest);


        //this URL is encoded according to aws s3 standards
        String returnURL= "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fullPath;
        String actual_filename_withoutEncoded=fileName;
        // Generate and return the file URL
        return Arrays.asList(returnURL,actual_filename_withoutEncoded);
    } catch (Exception e) {
        throw new RuntimeException("Failed to upload file to S3", e);
    }
}

    public byte[] downloadFile(String fileName) {
        S3Object s3Object = s3Client.getObject(bucketName, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        try {
            byte[] content = IOUtils.toByteArray(inputStream);
            return content;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


    public String EncodeToAWSs3FileNameFormat(String str){
        return URLEncoder.encode(str, StandardCharsets.UTF_8);
    }

    public String deleteFile(String fileName) {
        s3Client.deleteObject(bucketName, fileName);
        return fileName + " removed ...";
    }


    public String deleteFileWithPathSpecified(String folderPath, String fileName) {
        // Construct the full path (key) to the file in the S3 bucket
        String key = folderPath + "/" + fileName;
        logger.info("!!!!!!!!!!!!!!!!!!!!!11  {}",key);
        // Create a DeleteObjectRequest with the bucket name and the key
        DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(bucketName, key);

        // Delete the file from S3
        s3Client.deleteObject(deleteObjectRequest);

        String str=fileName + " removed from folder: " + folderPath;
        logger.info("!!!!!!!!!!!!!!!!!!!!!11  {}",str);
        return fileName + " removed from folder: " + folderPath;
    }



    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            log.error("Error converting multipartFile to file", e);
        }
        return convertedFile;
    }



    public void createFolderStructure(String baseFolderPath) {
        // Creating folder structure by uploading zero-byte objects with folder paths
        String[] folders = {"images", "draft"};
        for (String folder : folders) {
            String folderPath = baseFolderPath + "/" + folder + "/";
            try (InputStream emptyContent = new ByteArrayInputStream(new byte[0])) {
                s3Client.putObject(new PutObjectRequest(bucketName, folderPath, emptyContent, null));
            } catch (IOException e) {
                throw new RuntimeException("Failed to create folder structure", e);
            }
        }
    }


    public boolean doesFolderExist(String folderPath) {
    ListObjectsV2Request req = new ListObjectsV2Request().withBucketName(bucketName).withPrefix(folderPath);
    ListObjectsV2Result result = s3Client.listObjectsV2(req);

    // Check if any objects were returned with the given prefix (folderPath)
    return !result.getObjectSummaries().isEmpty();
}


}