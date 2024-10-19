package com.edit_editor.edit_editor.controller;


import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.edit_editor.edit_editor.Entity.BlogDetails;
import com.edit_editor.edit_editor.Entity.BlogDetails.Blog;
import com.edit_editor.edit_editor.models.DatabaseModels.Status;
import com.edit_editor.edit_editor.repository.BlogDetailsRepository;
import com.edit_editor.edit_editor.service.AWSbucketService;
import com.edit_editor.edit_editor.service.DraftManagementService;
import com.edit_editor.edit_editor.service.GetSetDraftId;
import com.edit_editor.edit_editor.service.VersionControlService;
@SuppressWarnings("all")
@Controller
@RequestMapping("/edit")
public class NewBlogController {

    @Autowired
    private AWSbucketService awsBucketService;

    @Autowired
    private BlogDetailsRepository blogDetailsRepository;

    @Autowired
    private DraftManagementService draftManagementService;

    @Autowired
    private VersionControlService versionControlService;

    @Autowired
    private GetSetDraftId getSetDraftId;


    private static final Logger logger = LoggerFactory.getLogger(NewBlogController.class);


    @GetMapping("/redirectToCreateBlog")
    public String redirectToCreate() {
        String blogId = Instant.now().toEpochMilli() + "";
        // Redirect to /create with the id parameter
        return "redirect:/edit/create?id=" + blogId;
    }

    @GetMapping("/create")
    public String createNewBlog(@RequestParam("id") String blogId, Model model) {
        // Generate a unique blog ID using timestamp
        getSetDraftId.setDraftId(getSetDraftId.getDraftId());

        logger.info("5oooooppppppsggsgs{}",blogId);
        
        String email = "r@gmail.com";
        //saveInitialBlogDetails(email,blogId);

        String folderPath = email + "/" + blogId;
        if (!awsBucketService.doesFolderExist(folderPath)) {
            // Create BlogDetails object
            //saveInitialBlogDetails(email,blogId);
            // Define folder structure
            awsBucketService.createFolderStructure(folderPath);

            return "edit_editor";
        }
        else{
            String draftFolderPathAlreadyExisted= email + "/" + blogId;
            Map<String, String> contentMap = draftManagementService.getContent(draftFolderPathAlreadyExisted);
            //blogId exist within email than return htmlcontent
            if( contentMap != null && contentMap.get("blogId") != null && contentMap.get("blogId").equals(blogId)){
                logger.info("tttttttttttttttttttttttt   {}", "yes");
                
                String retrievedBlogId = contentMap.get("blogId");
                if(retrievedBlogId.equals(blogId)){
                    String HTMLcontent = contentMap.get("content");
                    logger.info("tttthhhhhhhhhhhhhhhtt   {}", HTMLcontent);
                    model.addAttribute("HTMLcontent",HTMLcontent);

                    return "edit_editor";
                }

            }else{
                return "edit_editor";
            }

        }

        return "errorpage";
    }   



    public void saveInitialBlogDetails(String email, String blogId) {
        // Find the existing BlogDetails by email
        Optional<BlogDetails> optionalBlogDetails = blogDetailsRepository.findByEmail(email);

        BlogDetails blogDetails;
        
        if (optionalBlogDetails.isPresent()) {
            // If user exists, get the BlogDetails
            blogDetails = optionalBlogDetails.get();
        } else {
            // If user does not exist, create new BlogDetails
            blogDetails = new BlogDetails();
            blogDetails.setEmail(email);
            //manage account as it does not exist
        }

        // Create a new Blog
        Blog blog = new Blog();
        blog.setBlogId(blogId);
        blog.setVersionNumber(null);
        blog.setCreatedDate(LocalDateTime.now());
        blog.setLastModifiedDate(LocalDateTime.now());
        blog.setStatus(Status.DRAFT);

        // Add the new Blog to the existing list of blogs
        List<BlogDetails.Blog> blogs = blogDetails.getBlogs();
        if (blogs == null) {
            // If the list of blogs is null, create a new list
            blogs = new ArrayList<>();
        }
        blogs.add(blog);
        blogDetails.setBlogs(blogs);
        // Save BlogDetails back to the database
        blogDetailsRepository.save(blogDetails);
    }


}