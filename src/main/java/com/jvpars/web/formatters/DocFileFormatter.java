package com.jvpars.web.formatters;

import com.jvpars.domain.DocFile;
import com.jvpars.service.api.DocFileService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.util.Locale;


public class DocFileFormatter implements Formatter<DocFile> {

    @Autowired
    public DocFileService docfileService;


    public DocFile parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return docfileService.findOne(id);
    }

    public String print(DocFile docfile, Locale locale) {
        return docfile.toString();

    }
}