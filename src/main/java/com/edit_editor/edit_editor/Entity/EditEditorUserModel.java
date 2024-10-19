package com.edit_editor.edit_editor.Entity;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class EditEditorUserModel {

    private String email;

    private String HTMLcontent;


}
