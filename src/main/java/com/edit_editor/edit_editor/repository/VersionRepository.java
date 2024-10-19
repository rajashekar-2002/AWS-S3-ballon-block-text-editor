package com.edit_editor.edit_editor.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.edit_editor.edit_editor.Entity.EditEditorUserModel;

@Repository
public interface VersionRepository extends MongoRepository<EditEditorUserModel, String> {
    List<EditEditorUserModel> findByEmail(String email);
}