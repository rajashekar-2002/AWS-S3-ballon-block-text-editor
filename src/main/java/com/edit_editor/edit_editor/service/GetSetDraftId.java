package com.edit_editor.edit_editor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;

@Service
@Data
public class GetSetDraftId {
    private String draftId;

    private static final Logger logger = LoggerFactory.getLogger(GetSetDraftId.class);

    @Autowired
    private HttpServletRequest request;

    public String getDraftId() {
        if (draftId == null || draftId.isEmpty()) {
            draftId = extractIdFromRequest();
            logger.info("^^^^^^^^^^^^^^^^^^^^^^^{}",draftId);
        }
        return draftId;
    }

    private String extractIdFromRequest() {
        // Get the full request URL
        String queryString = request.getQueryString();

        if (queryString != null) {
            // Split the query string to find the 'id' parameter
            for (String param : queryString.split("&")) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2 && "id".equals(keyValue[0])) {
                    logger.info("^@#$!@%@$#%#@$^^^^^^^^^^{}",keyValue[1]);
                    return keyValue[1];
                }
            }
        }
        return null; // Or handle the case where 'id' is not present
    }
}
