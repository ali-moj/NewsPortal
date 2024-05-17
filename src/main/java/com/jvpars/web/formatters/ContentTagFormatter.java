package com.jvpars.web.formatters;

import com.jvpars.domain.ContentTag;
import com.jvpars.service.api.ContentTagService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.util.Locale;


public class ContentTagFormatter implements Formatter<ContentTag> {

    @Autowired
    public ContentTagService contenttagService;


    public ContentTag parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return contenttagService.findOne(id);
    }

    public String print(ContentTag contenttag, Locale locale) {
        return contenttag.toString();

    }
}