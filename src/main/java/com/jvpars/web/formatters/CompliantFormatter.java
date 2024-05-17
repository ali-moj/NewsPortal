package com.jvpars.web.formatters;

import com.jvpars.domain.Compliant;
import com.jvpars.service.api.CompliantService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.util.Locale;


public class CompliantFormatter implements Formatter<Compliant> {

    @Autowired
    public CompliantService compliantService;


    public Compliant parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return compliantService.findOne(id);
    }

    public String print(Compliant compliant, Locale locale) {
        return compliant.toString();

    }
}