package com.edit_editor.edit_editor.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edit_editor.edit_editor.Entity.BlogDetails;
import com.edit_editor.edit_editor.repository.BlogDetailsRepository;

@Service
public class VersionControlService {
    @Autowired
    private DraftManagementService draftManagementService;

    @Autowired
    private BlogDetailsRepository blogDetailsRepository;

    public void saveVersion(String email, String blogId, String content, Long versionNumber) {
        // Define the folder path and file name
        String folderPath = email + "/" + blogId + "/draft";
        String fileName = versionNumber + "_version.json";

        // Upload the content to S3
        draftManagementService.uploadContent(email,blogId,folderPath, fileName, content, versionNumber);

        // Manage draft folder to ensure a maximum of two files
        draftManagementService.manageDraftFolder(email, blogId, fileName);
    }






    public Long getBlogVersionNumber(String email, String blogId) {
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
                return blog.getVersionNumber();
            }
        }

        return null; // Email or blogId not found
    }


    
}
