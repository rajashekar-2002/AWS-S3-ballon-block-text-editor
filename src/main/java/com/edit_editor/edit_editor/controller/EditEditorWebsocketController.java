package com.edit_editor.edit_editor.controller;


import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.edit_editor.edit_editor.models.VersionPayload;
import com.edit_editor.edit_editor.service.VersionControlService;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
public class EditEditorWebsocketController {

    @Autowired
    private VersionControlService versionControlService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private static final Logger logger = LoggerFactory.getLogger(EditEditorWebsocketController.class);

    @MessageMapping("/saveVersion")
    @SendTo("/sendMessageToUpdateVersionControlWS/saveVersion")
    public void saveVersion(@Payload VersionPayload payload) {
        String email = "r@gmail.com";  // Replace with actual email

        Long versionNumber = payload.getVersion();
        // Example JSON payload
        try {
            // Create a map for the payload
            Map<String, Object> payloadMap = new LinkedHashMap<>();
            payloadMap.put("blogId", payload.getBlogId());  // Example blogId
            payloadMap.put("version", payload.getVersion());      // Example versionNumber
            payloadMap.put("content", payload.getContent()); // Example content
            
            // Convert the map to a JSON string using Jackson
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonPayload = objectMapper.writeValueAsString(payloadMap);

            versionControlService.saveVersion(email,payload.getBlogId(), jsonPayload, versionNumber);
        } catch (Exception e) {

            String notificationMessage = "failed to save";
            messagingTemplate.convertAndSend("/sendMessageToUpdateVersionControlWS/draftStatus", notificationMessage);
            e.printStackTrace();
        }

        
    }


}
