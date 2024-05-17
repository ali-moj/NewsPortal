package com.jvpars.web.formatters;

import com.jvpars.domain.Content;
import com.jvpars.service.api.ContentService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.util.Locale;


public class ContentFormatter implements Formatter<Content> {

    @Autowired
    public ContentService contentService;


    public Content parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return contentService.findOne(id);
    }

    public String print(Content content, Locale locale) {
        return content.toString();

    }
}