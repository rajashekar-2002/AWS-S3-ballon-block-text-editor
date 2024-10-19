package com.edit_editor.edit_editor.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VersionPayload {
    private String content;
    private Long version;
    private String blogId;
}
