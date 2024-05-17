package com.jvpars.web.formatters;

import com.jvpars.domain.ContentAlbum;
import com.jvpars.service.api.ContentAlbumService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.util.Locale;


public class ContentAlbumFormatter implements Formatter<ContentAlbum> {

    @Autowired
    public ContentAlbumService contentalbumService;


    public ContentAlbum parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return contentalbumService.findOne(id);
    }

    public String print(ContentAlbum contentalbum, Locale locale) {
        return contentalbum.toString();

    }
}