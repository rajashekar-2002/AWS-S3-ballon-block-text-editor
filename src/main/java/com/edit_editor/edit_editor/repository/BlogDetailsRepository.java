package com.edit_editor.edit_editor.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.edit_editor.edit_editor.Entity.BlogDetails;



public interface BlogDetailsRepository extends MongoRepository<BlogDetails, String> {
    Optional<BlogDetails> findByEmail(String email);
} 
    

