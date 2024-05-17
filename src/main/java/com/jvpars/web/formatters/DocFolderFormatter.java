package com.jvpars.web.formatters;

import com.jvpars.domain.DocFolder;
import com.jvpars.service.api.DocFolderService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.util.Locale;


public class DocFolderFormatter implements Formatter<DocFolder> {

    @Autowired
    public DocFolderService docfolderService;


    public DocFolder parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return docfolderService.findOne(id);
    }

    public String print(DocFolder docfolder, Locale locale) {
        return docfolder.toString();

    }
}