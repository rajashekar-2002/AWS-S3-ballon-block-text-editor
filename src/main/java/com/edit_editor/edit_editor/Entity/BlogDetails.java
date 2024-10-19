package com.edit_editor.edit_editor.Entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import com.edit_editor.edit_editor.models.DatabaseModels.Category;
import com.edit_editor.edit_editor.models.DatabaseModels.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("all")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class BlogDetails {

    private String email;

    private List<Blog> blogs;

    private Long DraftBlogCount;

    private Long PublishedBlogCount;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Blog {
        private String blogId;
        private String title;
        private String subtitle;
        private Status status;
        private Long versionNumber;
        private Set<Category> category;
        private LocalDateTime createdDate;
        private LocalDateTime lastModifiedDate;
    }
}
