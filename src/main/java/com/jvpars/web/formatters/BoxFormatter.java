package com.jvpars.web.formatters;

import com.jvpars.domain.Box;
import com.jvpars.service.api.BoxService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Locale;


public class BoxFormatter implements Formatter<Box> {

    @Autowired
    public BoxService boxService;


    public Box parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return boxService.findOne(id);
    }

    public String print(Box box, Locale locale) {
        return box.toString();

    }
}